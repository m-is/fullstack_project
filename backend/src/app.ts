import Fastify from "fastify";
import config from "./db/mikro-orm.config.js";
import cors from '@fastify/cors';
import { firebasePlugin } from "./plugins/firebase.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import DoggrRoutes from "./routes.js";



const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
		level: "debug",
	},
	production: {
		level: "error"
	},
	test: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
		level: "warn"
	},
};


const app = Fastify({
	logger: envToLogger[process.env.NODE_ENV]
});

await app.register(cors, {
	origin: (origin, cb) => {
		cb(null, true);
	},
	methods: ['GET','POST','PUT','DELETE','PATCH','SEARCH'],
});


//await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin);
//await app.register(AuthPlugin);
await app.register(DoggrRoutes);
await app.register(firebasePlugin);

export default app;
