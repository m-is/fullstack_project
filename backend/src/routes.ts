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
		
		const auth = getAuth(app.firebasePlugin)
		
		console.log(`email is ${email}`);
		console.log(`password is ${password}`);
		
		const newFirebaseUser = await createUserWithEmailAndPassword(auth, email, password);
		
		console.log(newFirebaseUser);
		
		try {
			
			const hashedPw = await bcrypt.hash(password, 10);
			
			const newUser = await req.em.create(User, {
				email,
				username,
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
	
	app.put<{Body: {email:string}}>("/gameover", async(req, reply) => {
		const { email } = req.body;
		let token;
		
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
			if(token[0]===`"`){
				token = token.slice(1,-1);
			}
		}
		
		if(!token){
			return reply.status(401).send();
		}
		
		else {
			//@ts-ignore
			const decodedToken = await app.firebase.auth().verifyIdToken(token);
			
			try{
				const theUser = await req.em.findOneOrFail(User, { email });
				//@ts-ignore
				const locations = await req.em.find(Location, {user_id: theUser.id});
				//@ts-ignore
				const inventory = await req.em.find(Item, {user_id: theUser.id});
			
				await req.em.remove(locations);
				
				await req.em.remove(inventory);
				
				await req.em.flush();
				
				const newLocation = await req.em.create(Location, {
					user: theUser,
					name: "farm",
					visited: false
				})
				
				await req.em.flush();
			
				reply.send(`${theUser.username} has game-overed and is now back at the farm`);
			} catch(err) {
				console.error(err);
				reply.status(500).send(err);
			}
		}
	});
	
}

export default ZorpRoutes;
