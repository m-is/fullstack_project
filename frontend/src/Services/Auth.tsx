import { httpClient } from "@/Services/HttpClient.tsx";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


export const AuthContext = createContext<AuthContextProps | null>(null);

const firebaseConfig = {
	apiKey: "AIzaSyCozVVwQa4VTZO_z2pVptiJnj1lKRmzLVM",
	authDomain: "zorp-c7155.firebaseapp.com",
	projectId: "zorp-c7155",
	storageBucket: "zorp-c7155.appspot.com",
	messagingSenderId: "447122475646",
	appId: "1:447122475646:web:554c21ec7bcd71dc53262f",
	measurementId: "G-TJJ62R37J7"
};

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);

export type AuthContextProps = {
	token: string | null;
	userEmail: string;
	handleLogin: (email: string, password: string) => Promise<boolean>;
	handleLogout: () => void;
};

const updateAxios = async (token: string) => {
	console.log(`In changing header auth with ${token}`);
	httpClient.interceptors.request.use(
		async (config) => {
			// @ts-ignore
			config.headers = {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			};
			
			return config;
		},
		(error) => {
			console.error("REJECTED TOKEN PROMISE");
			Promise.reject(error);
		}
	);
};

const initialToken = getTokenFromStorage();
let initialUserEmail;

if (!(initialToken == null)) {
	console.log("Updating axios with token: ", initialToken);
	await updateAxios(initialToken).then();
	initialUserEmail = getUserEmailFromToken(initialToken);
}

export const AuthProvider = ({ children }: any) => {
	const navigate = useNavigate();
	
	const [token, setToken] = useState(initialToken);
	const [userEmail, setUserEmail] = useState(initialUserEmail);
	
	const handleLogin = async (email: string, password: string) => {
		console.log("In handleLogin with ", email, password);
		
		try {
			const thetoken = await getLoginTokenFromServer(email, password);
			saveToken(thetoken);
			await updateAxios(thetoken);
			// Hooray we're logged in and our token is saved everywhere!
			navigate(-1);
			return true;
		} catch (err) {
			console.error("Failed to handle login: ", err);
			navigate("/login");
			return false;
		}
	};
	
	const handleLogout = () => {
		setToken(null);
		signOut(auth).then(response => console.log(response));
		localStorage.removeItem("token");
	};
	
	const saveToken = (thetoken) => {
		console.log(thetoken);
		setToken(thetoken);
		setUserEmail(getUserEmailFromToken(thetoken));
		localStorage.setItem("token", JSON.stringify(thetoken));
	};
	
	return (
		<AuthContext.Provider
			value={{
				token,
				userEmail,
				handleLogin,
				handleLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

function getTokenFromStorage() {
	const tokenString = localStorage.getItem("token");
	console.log(tokenString);
	if ( typeof tokenString === 'undefined' || tokenString === null) {
		console.log("No token found");
		return null;
	}
	console.log("Token found: ", tokenString);
	return tokenString;
}

export async function getLoginTokenFromServer(email, password) {
	
	const login_result = await signInWithEmailAndPassword(auth,email,password);
	const token = await login_result.user.getIdToken(true);
	console.log(token);
	return token;
	
}

export function getPayloadFromToken(token: string) {
	const base64Url = token.split(".")[1];
	if (base64Url == null) {
		console.log("Yikes your token has no payload, how did that happen?");
	}
	
	// Mostly ignore me, taken from JWT docs, this extracts the text payload from our token
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);
	
	const payload = JSON.parse(jsonPayload);
	console.log(payload);
	return payload;
}

function getUserEmailFromToken(token: string) {
	const payload = getPayloadFromToken(token);
	console.log(payload.email);
	return payload.email;
}
