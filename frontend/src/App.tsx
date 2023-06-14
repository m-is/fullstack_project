import { AuthProvider } from "@/Services/Auth.tsx";
import { ZorpRouter } from "@/ZorpRoutes.tsx";
import React, { Suspense, useState } from "react";
import "@css/ZorpStyles.css";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";


// This is our first React "Component"
	export function App() {
		return (
			<BrowserRouter>
				<RecoilRoot>
					{/* Catches Recoil errors */}
					{/*<ErrorBoundary fallback={<div>Something evil this way comes...</div>}>*/}
					{/* Shows temp loading screen during async fetches */}
					<Suspense fallback={<div>Loading...</div>}>
						<AuthProvider>
							<div className="App Zorp">
								<ZorpRouter/>
							</div>
						</AuthProvider>
					</Suspense>
					{/*</ErrorBoundary>*/}
				</RecoilRoot>
			</BrowserRouter>
		);
	}

export default App;
