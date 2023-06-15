import { Location } from "./db/entities/Location.js";
import { User } from "./db/entities/User.js";
import { Item } from "./db/entities/Item.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

async function LocationRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	
	//Add new location to User's world map
	app.post<{Body: { location: string, email: string } }>("/location", async (req, reply) => {
		const { location, email} = req.body;
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
		}
		
		try {
			const user = await req.em.findOne(User, { email });
			const newLocation = await req.em.create(Location, {
				user,
				name: location,
				visited: false
			})
			
			await req.em.flush();
			return reply.send(newLocation);
		} catch(err){
			console.error(err);
			return reply.status(500).send(err);
			
		}
	})
	
	
	// A search method to find the locations that a user has discovered
	app.search<{Body: { userEmail: string } }>("/location", async (req, reply )=> {
		const { userEmail } = req.body;
		
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
		}
		
		try{
			const theUser = await req.em.findOneOrFail(User, {email: userEmail})
			const locations = await req.em.find(Location, {user_id: theUser.id})
			return reply.send(locations);
		} catch (err) {
			return reply.status(500).send({message: err.message});
		}
	})
	
	//Change a user's location from unvisited to visted
	app.put<{Body: { location: string, email: string } }>("/location", async (req, reply) => {
		const { location, email} = req.body;
		
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
		}
		
		try {
			
			const user = await req.em.findOne(User, { email });
			const toVisit = await req.em.findOne(Location, { user, name: location })
			
			toVisit.visited = true;
			
			await req.em.flush();
			return reply.send(`${location} has been visited on ${email} user map`);
		}
		catch(err) {
			console.error(err);
			return reply.status(500).send(err);
		}
	})
	
	
}

export default LocationRoutes;
