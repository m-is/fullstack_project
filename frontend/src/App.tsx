import { ZorpRouter } from "@/ZorpRoutes.tsx";
import React, { useState } from "react";
import reactLogo from "@images/react.svg";
import viteLogo from "/vite.svg";
import "@css/App.css";
import { BrowserRouter } from "react-router-dom";


// This is our first React "Component"
	export function App() {
		return (
			<BrowserRouter>
					<div className="App Zorp">
						<ZorpRouter/>
					</div>
			</BrowserRouter>
		);
	}

export default App;
