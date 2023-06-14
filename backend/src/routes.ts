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
async function ZorpRoutes(app: FastifyInstance, _options = {}) {
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
	
	const verifyToken = async (req:FastifyRequest) => {
		let token = null;
		
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
			token = token.slice(1,-1);
		}
		
		if(!token){
			return(401);
		}
		
		else {
			const decodedToken = await app.firebase.auth().verifyIdToken(token);
			console.log(decodedToken);
			return decodedToken;
		}
	};

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
		
		const auth = getAuth(app.firebaseAuth)
		
		console.log(`email is ${email}`);
		console.log(`password is ${password}`);
		
		const newFirebaseUser = await createUserWithEmailAndPassword(auth, email, password);
		
		console.log(newFirebaseUser);
		
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
			
			console.log(`Created new user: ${newUser.username} with location: ${newLocation.name}` );
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({ message: err.message });
		}
		
	});

	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;
		/*
		const verification = await verifyToken(req);
		
		if(verification===401||verification===null){
			reply.status(401).send("Authorizatin failed, no valid token");
			return;
		}
		*/
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
		/*
		const verification = await verifyToken(req);
		
		if(verification===401||verification===null){
			reply.status(401).send("Authorizatin failed, no valid token");
			return;
		}
		*/
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
		
		const auth = getAuth(app.firebaseAuth);
		
		const authEmail = email;
		const authPass = password;
		
		const login = await signInWithEmailAndPassword(auth,authEmail,authPass);
		
		const token = await login.user.getIdToken();
		
		reply.send({ token});
		
		
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
}

export default ZorpRoutes;
