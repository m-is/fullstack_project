import dotenv from "dotenv";
dotenv.config();
import {FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import Jwt, {VerifyPayloadType} from "@fastify/jwt";
import fp from "fastify-plugin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCozVVwQa4VTZO_z2pVptiJnj1lKRmzLVM",
	authDomain: "zorp-c7155.firebaseapp.com",
	projectId: "zorp-c7155",
	storageBucket: "zorp-c7155.appspot.com",
	messagingSenderId: "447122475646",
	appId: "1:447122475646:web:554c21ec7bcd71dc53262f",
	measurementId: "G-TJJ62R37J7"
};

declare module 'fastify' {
	
	interface FastifyInstance {
		firebase: any,
	}
}



export const firebasePlugin = fp(async function(app: FastifyInstance, opts: FastifyPluginOptions) {
	const firebase = initializeApp(firebaseConfig);
	app.decorate("firebase", firebase);
})
