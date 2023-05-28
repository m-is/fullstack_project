import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Item } from "./db/entities/Item.js";
import { Location } from "./db/entities/Location.js";
//import { Match } from "./db/entities/Match.js";
import { User } from "./db/entities/User.js";
import { ICreateUsersBody } from "./types.js";

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

		try {
			const newUser = await req.em.create(User, {
				email,
				username,
				password
			});

			await req.em.flush();

			console.log("Created new user:", newUser);
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
		const { username, email, password } = req.body;

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

	// CREATE MATCH ROUTE
	app.post<{ Body: { email: string; matchee_email: string } }>("/match", async (req, reply) => {
		const { email, matchee_email } = req.body;

		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, { email: matchee_email });
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, { email });

			//create a new match between them
			/*
			const newMatch = await req.em.create(Match, {
				owner,
				matchee,
			});
			*/
			
			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send();
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
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
				return reply.send(`${item} added to ${email} user inventory`);
			
		 
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
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
			return reply.send(`${location} added to ${email} user map`);
		} catch(err){
			console.error(err);
			return reply.status(500).send(err);
			
		}
	})

	//Change a user's location from unvisited to visted
	app.post<{Body: { location: string, email: string } }>("/location", async (req, reply) => {
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
