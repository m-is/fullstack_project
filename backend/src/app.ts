import Fastify from "fastify";
import config from "./db/mikro-orm.config.js";
import cors from '@fastify/cors';
import { AuthPlugin } from "./plugins/auth.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import DoggrRoutes from "./routes.js";
//import fastifyFirebase from 'fastify-firebase';
import { firebasePlugin } from "./plugins/firebase.js";

//import firebase from "'fastify-firebase-auth'";

const firebaseConfig = {
	apiKey: "AIzaSyCozVVwQa4VTZO_z2pVptiJnj1lKRmzLVM",
	authDomain: "zorp-c7155.firebaseapp.com",
	projectId: "zorp-c7155",
	storageBucket: "zorp-c7155.appspot.com",
	messagingSenderId: "447122475646",
	appId: "1:447122475646:web:554c21ec7bcd71dc53262f",
	measurementId: "G-TJJ62R37J7"
};



const key = {
	"type": "service_account",
	"project_id": "zorp-c7155",
	"private_key_id": "1226bfa7ea648ed3c109c57a27c87bc67d8e31be",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCkPQK55yd/EFDa\naFJS8f+IdJpn/fY0Ra7Y45yqLk0zB1gudFLH+dM+V4Ubs+SYjT79Qw6cXxbVkqoA\nHJPmZUZhY9M1VeIkMpmZK2OH+IhvlpuBqnL3+45K3iv7Xmkw6FMSvdRqG7dhpaUO\n60uoyzDv1wnhHS4gYvZsxA66P9VClj9WEfdDav5r2MKhpixVRPop9nNejLpT51tc\ndotI+hPo5xWAzNgJsJUaGuAmUK+upxhAzbGVPKyCRtzZ5DoRTZzAShYaKHUpZqYD\ngUbX4SYmAX6UftXzUCEf+QERKCUddAvAS/rbKgvjAJgTyu6YfteoNAuWk2Qb96/W\nJaq1uDCHAgMBAAECggEALwUCg0uAvLlklGq6auG6aQwM6onEE0oB2TkssHIKCvpm\nzgHiczr8NcRjqL8zSlNhvasVg0Ib7PAMuHR2CUdkQ1yLaqEYWYmc/MN1vscx9FR3\nV8N/H6zGm3uItvHcBrL0mZB8QBaIRS3hl+hYJE5rx7ZWLzsl6gK7Dv+AQeUlfmbE\ngKFy5wtiTGJ3LVawOlh8JsOLWUfXicjEsToljaTG3oL3vIKuPXSlgK9Rw4Q8jeEM\nzq4PZdoVtJt3lsGL7SyJy7w65rk9R0p2SyXDchNZP7HDbEuiuc6Mhrim+kfWj0SY\nL6mXwx/ohJsaEudq+BqHfr/oU73250RXFxrmSksVnQKBgQDgTP9uYGJtZHcjcH/x\nY9mTb/ljAmRlYh61Lvsq4sHZECvGZEKOQeFx3ZdTBG4MZWGIulDVsqdZhlfucF2K\ntkmRubIr+IGjBaptghTAEmNRLA7O70AGNah/8KLtNAd1LCj1HfnWNggI3Oucd+Fm\nGn5RukH5ejxoFG47PZfHZjacAwKBgQC7cwHFtoPmH9CHNwSoXo6QAPaTFLvzh5ti\ne1oPca7hRmuAIPLK9lgnVPr8oOSGzyJH6tDMFhVt2pPfsaCSiu9RYOd+I1B3aW09\nan53pGZ2NbBqGZpEva9m/RGE9/YqzPajVjWicSOgb+ewN7yCSKVyT+Re8jkNyoQ+\nzCSr/MTsLQKBgBrGNitnx/gE6Q/K6wrWf29RC3TdITzU5JN+Iy8wWDFf88m/yA4R\nIScla13WhohmRak7jFCl/cH6/l4Q/amELu39O55yEI90Kq7duzpeN4rF9pKPDpZv\nK0jyYZBtCILdHZp81IjUdEsSi/FmgfpdKTz6PcvY4oMOBUZ/CLIdqmEfAoGACBSA\nCg7BBsVuTrXPbJaO3KQ9/L8TDv9Ucl1Q14OV/z3y2lYRQTB3QlLGcudYknsRRjpX\n/8Qf7llSsHzOqCJ3CHH96JELIeqYe+JAS1X52LSdwyURYk8u5WiZPbsWkGe/ZfEM\nZNEtsPfB6/WrGY6aGyBYfsNANFj7dF2GYyeFMY0CgYA7pX73j4cR7yG0a7b9WB7u\nKvMMoBdNQM8K/wGkKuaQwwg2mf59mFdgVmLQmaGA0qjRvXV9TpHuWzGVg9F9SKlJ\nX8dHgLsfc9++6xedTj7HWMidN+yXwjAVDI7bK/C1bDBlSys1bGRpGNlkuJCXHRaJ\n3eNi0U3kk1TITD4CFBfcWA==\n-----END PRIVATE KEY-----\n",
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
await app.register(AuthPlugin);
await app.register(DoggrRoutes);
//await app.register(fastifyFirebase, key);
await app.register(firebasePlugin);

export default app;
