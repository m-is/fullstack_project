import Fastify from "fastify";
import config from "./db/mikro-orm.config.js";
import cors from '@fastify/cors';
import ItemRoutes from "./item_routes.js";
import LocationRoutes from "./location_routes.js";
import { firebasePlugin } from "./plugins/firebase.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import ZorpRoutes from "./routes.js";
import fastifyFirebase from "@now-ims/fastify-firebase"

const key = {
	"type": "service_account",
	"project_id": "zorp-c7155",
	"private_key_id": "56e1c45bf3c8184da974376767029a7692c651c3",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCW0J2UaCkEiHsQ\nK9+LNhq6JIaj5++XO//Olz9xhNXvWvsxyRZpKr3oesFEKvCPJ3vHW4jqmE3ejI5u\nRc+WxXD/1RiEzbnpEhnn3BLmfIxOF3OuvpYI3D8FNxtYCfyUmccZdgr5AnTtL549\noEJkRyhEmtwS5yr80Y6B/RMdNqSYw2G0knWCLnnBlzOlNIC8shUr7Zi8+vF8VFiy\ngq53ykcr1Y5x/PZB8rDNeH4W8FSyFPm8kcZBgT2RT/CKL2dPoH1YOQ8XAdyOD0ec\nCR791Y/v6W1uky5gd4Ym2nXsk4Twf6ZrxwDTLe1cb0iQea7qm8hTWSUiJgqea9IL\nHo88jdBZAgMBAAECggEADZvjkrm922ZDAv5cHK0txwndI6GeEbdc6cdLw7JpHHRi\nrs2Z4E5c3RAx3zUOVT/Xc1gQlQK+iOXsEFbr8lhjGvxsSvrGQbOopmIW5OxTCNTx\nUzc1eLU1jQK5zL1ewm+h8x7SXKf0S/B8RsyIUSr7a9cBihJVsByeaTjTmblz+HWj\n4YC29nnybjGr1TRppsqbAmETmp51oeIdy8n5D5fvfUtewNOBQJHzjwd+Jp+z9AV0\nJwdUcw4dQjkuZwIqhIT1Io56EP2hrSn0Y6daYYfAO5ftpMy7LpxXbB7idq7wqyWL\niSdHi3dwe5Z+GqFSiazPTaAxFMenF7GtKN3bXr4LJQKBgQDQ8c4X0EHYtepA71vt\n6bDEO7zWmnoBwa+Sn0Ol4cMGl8R4E8ebGb3LyUk10yjie2FheOi8NkWyZIDS/OvP\nFaJ3RUcpwbPEJdchN3R06Y3MVEWBg9ziECRs/R1EKAP9/okPg6sfyDMHLIb8dv0a\n41erqIK1LFN/Lv5OR1kF/64K3wKBgQC4x3xW8UAyiEyLEv4M46JXSy3pIjcXshDp\n8IV/HJP61tUdAjWCLsuEFdyMzYeYs1Q9ZeOssDlor3X95k9dGWsvv0+UedPlvgq7\nzrEy3hYCgjkTN6MR8iql5DryywB4F+sHIePMfec9XEm1vFZNydeCsm0lb5Qppg8v\nwunuePVDxwKBgGqLAnYuIYVprZuS8iNsyFAnzfD4MEJ5CxgO0iXh6tqPxQUdwOib\nxaYGa6hgljZ2h392ceaXHg8LJI1xnqSn+YIr90+ZkBry2LH9XwrGlSGdzxttq9Iy\nPQC+SJAaf36iri0VDMtWAH8l+2b9Ha76QhgsAwpzIdh2lAJCa2idqZetAoGBAIdd\nhMaAqGIcnc6IlFrG7Gf86F5RNYEDbwaisHmlavcpKSi+NIrxUyCpj1ALRZnlTgJI\nwVkCJJx/ZfYiIeP3OiHZiiggc85rwZtCWWgFcKRX2A4vBSShfwLWxySU+PwBsakg\n96wYVC4MjOc5WRRVmK7jnbf+HNHCGIAJz6xnKm6DAoGBALvR6Xall4BOl9SqzNi7\nKAfnqQt8Y4VmIbOdytK7Y+Xt9HCjcCVpSv3hy9I0C9y68YaLFh5ArJpkdau1vTBu\ngQtC+83EfnE966w8XxE70/9aqsoJN22hS+Nq0IhiqGTzVQ2wYiEUpGLXsk+IAcsJ\nkqXHk9+xYNt3PGNxbMLExuYH\n-----END PRIVATE KEY-----\n",
	"client_email": "firebase-adminsdk-5wd0b@zorp-c7155.iam.gserviceaccount.com",
	"client_id": "102517931400568005987",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5wd0b%40zorp-c7155.iam.gserviceaccount.com",
	"universe_domain": "googleapis.com"
}



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


await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin);
await app.register(fastifyFirebase, {cert:key});
await app.register(ZorpRoutes);
await app.register(ItemRoutes);
await app.register(LocationRoutes);
await app.register(firebasePlugin);

export default app;
