import { User } from "./db/entities/User.js";
import { Item } from "./db/entities/Item.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

async function ItemRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	
	//Add item to inventory route
	app.post<{Body: { item: string, email: string } }>("/inventory", async (req, reply) =>{
		const { item, email } = req.body;
		
		let token = null;
		
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
			if(token[0]===`"`){
				token = token.slice(1,-1);
			}
		}
		
		if(!token){
			return(401);
		}
		
		else {
			//@ts-ignore
			const decodedToken = await app.firebase.auth().verifyIdToken(token);
		}
		
		try{
			
			const user = await req.em.findOne(User, {email});
			
			const newItem = await req.em.create(Item, {
				user,
				name: item,
			});
			
			
			await req.em.flush();
			return reply.send(newItem);
			
			
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
	})
	
	
	// A search method to retreive a user's inventory
	app.search<{Body: { userEmail: string } }>("/inventory", async (req, reply )=> {
		const { userEmail } = req.body;
		
		let token = null;
		
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
			if(token[0]===`"`){
				token = token.slice(1,-1);
			}
		}
		
		if(!token){
			return(401);
		}
		
		else {
			//@ts-ignore
			const decodedToken = await app.firebase.auth().verifyIdToken(token);
		}
		
		try{
			const theUser = await req.em.findOneOrFail(User, {email: userEmail})
			const inventory = await req.em.find(Item, {user_id: theUser.id})
			return reply.send(inventory);
		} catch (err) {
			return reply.status(500).send({message: err.message});
		}
	})
	
}

export default ItemRoutes;
