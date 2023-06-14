import dotenv from "dotenv";
dotenv.config();
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import fp from "fastify-plugin";
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";

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
	"private_key_id": "d98c5089d11df6e3434e3df7a7041a9fa03ee15e",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCy12GMl2rhSxkO\nkhK3Ef3gvKKbaxSKjrboy4Ul2gKlKSQC0msdS0ijwlzc4lxb4Cb4R3ifqOIlOOlF\nE59Q8Hysi0jQ1j16OsHU5xc85JkSB+DybHymAH4PX5VxrsckU1oJZZHO49CDlV/i\nNVI50prTIhENrIQO0Ydro6xuxNz04gXlr0I2aBp5sK/t5qif1uPaDh7ItfvA+S4B\nhGBnYLFfDnDR8EYr0LUR89BGeWZGMWZIx7rAyw45P98P4MFm35Ve3PR4Szw/4Q06\nN1/jdJDNiUAwBZKyuSU+59XZ3wtKC9uGLP8VFywsIF85Km21UrsmtbXDZ9YiDor/\nw4YYkYDTAgMBAAECggEADW1nWQ9rSmQBixsDhbQ3m/59tO6KucZyTDMvmYJvTWgz\n2HRk72ueFhF7OGhUZ9+B/YUcNNyQshu+Q93vybtsmOXSPz++mOU9dVcuYveE2Jo3\n1Ou5RhtmW5AhH8pwEDWj3m2+T0rCdoaqDslTFZ1O24hEwIKR3az0nmvI//4O2uHX\nHi0yrGJ79U6DvnKvSzO2a1BC7iX2qcNqkN6hwQ9hmUbVA5JBqIMvsSdcMP4IyvL1\nCvrVqUJg4AZWOfjg3bhztu4/PPRaxNFKLJTzXyEThZmRuJpmynTHLS/v4N5pkJDE\n3wBbKnwTKANe8MnlLeEt/2Wt3sKBNR454dmB4vbKrQKBgQDuovfLqhHovCNN2lxj\nTCPVkc3Xvh6bCt4F3Laz+RPRRc2j1docASBoTlH65Hz4wyKu2c5tYYivE1NdcaVy\n0R7kRyifwn2tI2766hSVf5q2mW/u/yL7wOaE9mQ6cIhZVaICklMMNsW82VwlJX9j\n37H0OFQ++VpUNML5OI2+poFLhQKBgQC/2p6nZcAT8JD/Egj4dm1ikKM4ens9qMHI\nbL8tcsspyXkUPbRyFJXOrzwaMkqVeD+zWkX7qJBGhK4wzcDKj4t/TwLoxOl8bKR8\ngd4Qpg7wM62NU1Idko6r8G0TbCIMCoH3I+mm+A8eapf0P3vMottXEZFkqTQ+VlDM\nVLQxZoeudwKBgQDJW4OhO0DfU5iqgX0BYGbAN8Yrq8VhZ5sN8T3MwHfjVnX9L15Z\n0O2KdcOg4xk8QlNKnIgdLXZK3BC0wUcsiZ36WrzBiTfIVyS23bs+pixitTeIv4nC\nSfN47/qEgR3b23DXoKYooTLadcHVqj1Chac/fiQ/+uEoOljmN70KyK5CjQKBgFJL\npOKJcusathez1MU/h4xQHrOLVnIMgZNHknocU6mJErbsAQsuaVRPNqjGCdgzzJ9S\nidJ5a+nT4CRvHdPF30Cs08KlNMJ6l9QQoQDjOmUuxbNpmj+1Lh3y89bw+2nO2BD7\nBq7omROjBatvz9rnwM6IaqWTLyXOQLplWyYVpP3hAoGBAJwPtNB3ikqpVjWjszwA\nusvVh7iB2ZFd4oppnWUSuXuBDkUGC3tF0DwmMcTu1KDwGRRdcdeA752WeVONcUMd\nbBXagfqpUSv1/+bdPyGLNK9rlktPJp1sYE9FwJL/t/bqAeVTVGYjB/0vIMzdrAfF\nuj4HLPoxQg68ePc8ptACibZo\n-----END PRIVATE KEY-----\n",
	"client_email": "firebase-adminsdk-5wd0b@zorp-c7155.iam.gserviceaccount.com",
	"client_id": "102517931400568005987",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5wd0b%40zorp-c7155.iam.gserviceaccount.com",
	"universe_domain": "googleapis.com"
}


declare module 'fastify' {
	
	interface FastifyInstance {
		firebasePlugin: any,
		firebaseAuth: any,
	}
}

export const firebasePlugin = fp(async function(app: FastifyInstance, opts: FastifyPluginOptions) {
	
	const firebase = initializeApp(firebaseConfig);
	app.decorate("firebasePlugin", firebase);
	
	const firebaseAuth = admin.initializeApp({
		credential: admin.credential.cert("/home/d/workspace/FullstackWeb/fullstack_project/fullstack_project/backend/src/firebasePrivateKey.json")
	});
	
	app.decorate("firebaseAuth", firebaseAuth);
	
})
