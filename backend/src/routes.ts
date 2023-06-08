import { create } from "domain";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Item } from "./db/entities/Item.js";
import { Location } from "./db/entities/Location.js";
import bcrypt from "bcrypt";
import { User } from "./db/entities/User.js";
import { ICreateUsersBody } from "./types.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

/** This function creates all backend routes for the site
 *
 * @param {FastifyInstance} app - The base Fastify listen server instance
 * @param {{}} _options - Fastify instance options (Optional)
 * @returns {Promise<void>} - Returns all of the initialized routes
 */
async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.get("/hello", async (request: FastifyRequest, reply: FastifyReply) => {
		return "hello";
	});

	app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(User, {});
	});
	
	app.get("/inventoryTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(Item, {});
	});
	

	// Core method for adding generic SEARCH http method
	// app.route<{Body: { email: string}}>({
	// 	method: "SEARCH",
	// 	url: "/users",
	//
	// 	handler: async(req, reply) => {
	// 		const { email } = req.body;
	//
	// 		try {
	// 			const theUser = await req.em.findOne(User, { email });
	// 			console.log(theUser);
	// 			reply.send(theUser);
	// 		} catch (err) {
	// 			console.error(err);
	// 			reply.status(500).send(err);
	// 		}
	// 	}
	// });

	// CRUD
	// C
	app.post<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
		const { username, email, password } = req.body;
		
		const auth = getAuth(app.firebase)
		
		const emailstring = email;
		
		console.log(`email is ${emailstring}`);
		console.log(`password is ${password}`);
		
		const newUser = await createUserWithEmailAndPassword(auth, "email@gmail.com", "password");
		
		console.log(newUser);
		
		reply.send(newUser);
		
		
		
		/*
			.then((user)=>{
				console.log(user);
				//reply.send(user);
			})
			.catch((error)=>{
				console.log(error.message);
				//reply.status(500).send();
		})
		
		
		
		/*
		auth.createUserWith({
			uid: 'some-uid',
			email: 'user@example.com',
			phoneNumber: '+11234567890',
		})
			.then((userRecord) => {
				// See the UserRecord reference doc for the contents of userRecord.
				console.log('Successfully created new user:', userRecord.uid);
				
			})
			.catch((error) => {
				console.log('Error creating new user:', error);
			});
		/*
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				return reply.send(user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(`Failed to create new user ${errorCode}`, error.message);
				return reply.status(500).send({ message: error.message });
			});
		/*
		try {
			
			const hashedPw = await bcrypt.hash(password, 10);
			
			const newUser = await req.em.create(User, {
				email,
				username,
				password:hashedPw
			});
			
			await req.em.flush();

			const newLocation = await req.em.create(Location, {
				user: newUser,
				name: "farm",
				visited: false
			})
			
			await req.em.flush();
			
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({ message: err.message });
		}
	
		 */
	});

	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;

		try {
			const theUser = await req.em.findOne(User, { email });
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// UPDATE
	app.put<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
		const { username, email } = req.body;

		const userToChange = await req.em.findOne(User, { email });
		userToChange.username = username;

		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
	});

	// DELETE
	app.delete<{ Body: { email } }>("/users", async (req, reply) => {
		const { email } = req.body;

		try {
			const theUser = await req.em.findOne(User, { email });

			await req.em.remove(theUser).flush();
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// Login route
	app.post<{ Body: { email: string; password: string } }>("/login", async (req, reply) => {
		const { email, password } = req.body;
		
		const token = await app.firebase.signInWithEmailAndPassword(email,password);
		
		reply.send(token);
		
		
		/*
		let token = null;
		
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
		}
		
		if(!token){
			reply.status(401).send("Authorization failed, no valid token");
		}
		else {
			const decodedToken =app.firebaseAuth.verifyIdToken(token);
			console.log(decodedToken);
		}
		
		/*
		const token = await app.firebase.auth().createCustomToken(uid);
		const login = getAuth(app.firebase);
		
		reply.send(token);
		/*
		app.firebase.auth()
			.createCustomToken(uid)
			.then((customToken) => {
				// Send token back to client
				token = customToken;
				console.log(customToken);
				console.log("We are here");
				//reply.send(`The custom token is ${token}`);
				//return;
			})
			.catch((error) => {
				console.log('Error creating custom token:', error);
				//reply.status(500).send();
			});
		//reply.send(`The custom token is ${token}`);
		/*
		try {
			const theUser = await req.em.findOneOrFail(User, {email}, {strict: true})
			
			const hashCompare = await bcrypt.compare(password, theUser.password);
			
			if(hashCompare) {
				const userId = theUser.id;
				const token = app.jwt.sign({userId});
				
				reply.send({token});
			} else{
				app.log.info(`Password validation failed -- ${password} vs ${theUser.password}`)
				reply.status(401).send("Failed authentication, incorrect password");
			}
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
		
		 */
	});
	
	//Add item to inventory route
	app.post<{Body: { item: string, email: string } }>("/inventory", async (req, reply) =>{
		const { item, email } = req.body;
		try{
			
				const user = await req.em.findOne(User, {email});
				
				const newItem = await req.em.create(Item, {
					user,
					name: item,
				});
				
				
				await req.em.flush;
				return reply.send(`${newItem.name} added to ${email} user inventory`);
			
		 
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
	})
	
	// A search method to retreive a user's inventory
	app.search<{Body: { userId: number } }>("/inventory", async (req, reply )=> {
		const { userId } = req.body;
		
		try{
			const inventory = await req.em.find(Item, {userId})
			return reply.send(inventory);
		} catch (err) {
			return reply.status(500).send({message: err.message});
		}
	})


	//Add new location to User's world map
	app.post<{Body: { location: string, email: string } }>("/location", async (req, reply) => {
		const { location, email} = req.body;
		
		try {
			const user = await req.em.findOne(User, { email });
			const newLocation = await req.em.create(Location, {
				user,
				name: location,
				visited: false
			})
			
			await req.em.flush;
			return reply.send(`${newLocation.name} added to ${email} user map`);
		} catch(err){
			console.error(err);
			return reply.status(500).send(err);
			
		}
	})
	
	
	// A search method to find the locations that a user has discovered
	app.search<{Body: { userId: number } }>("/location", async (req, reply )=> {
		const { userId } = req.body;
		
		try{
			const locations = await req.em.find(Location, {user_id: userId})
			return reply.send(locations);
		} catch (err) {
			return reply.status(500).send({message: err.message});
		}
	})

	//Change a user's location from unvisited to visted
	app.put<{Body: { location: string, email: string } }>("/location", async (req, reply) => {
		const { location, email} = req.body;
		
		try {
		
			const user = await req.em.findOne(User, { email });
			const toVisit = await req.em.findOne(Location, { user, name: location })
			
			toVisit.visited = true;
			
			await req.em.flush;
			return reply.send(`${location} has been visited on ${email} user map`);
		}
		catch(err) {
			console.error(err);
			return reply.status(500).send(err);
		}
	})

}

export default DoggrRoutes;
