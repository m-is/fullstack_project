import { AuthProvider } from "@/Services/Auth.tsx";
import { ZorpRouter } from "@/ZorpRoutes.tsx";
import React, { useState } from "react";
import "@css/ZorpStyles.css";
import { BrowserRouter } from "react-router-dom";


// This is our first React "Component"
	export function App() {
		return (
			<BrowserRouter>
				<AuthProvider>
					<div className="App Zorp">
						<ZorpRouter/>
					</div>
				</AuthProvider>
			</BrowserRouter>
		);
	}

export default App;
