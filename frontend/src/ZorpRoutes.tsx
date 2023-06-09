import { City } from "@/Components/City.tsx";
import { Farm } from "@/Components/Farm.tsx";
import { Gates } from "@/Components/Gates.tsx";
import { Home } from "@/Components/Home.tsx";
import { Login } from "@/Components/Login.tsx";
import { Logout } from "@/Components/Logout.tsx";
import { ProtectedRoute } from "@/Components/ProtectedRoute.tsx";
import { Shop } from "@/Components/Shop.tsx";
import { SidePath } from "@/Components/SidePath.tsx";
import { SignUp } from "@/Components/SignUp.tsx";
import { Village } from "@/Components/Village.tsx";
import { WorldMap } from "@/Components/WorldMap.tsx";
import { useAuth } from "@/Services/Auth.tsx";

import React from "react";
import { Link, Route, Routes } from "react-router-dom";

export function ZorpRouter() {
	const auth = useAuth();
	
	return (
		<div className={"landing"} >
			<nav>
				<div>
					<div>
						<ul className={"navbar"}>
							<li className={"nav-item"}><Link className={"link"} to="/">Home</Link></li>
							{auth?.token != null ? (
								<>
									<li className={"nav-item"}><Link className={"link"} to ="/map">World Map</Link></li>
									<li className={"nav-item"}><Link className={"link"} to ="/logout">Log-out</Link></li>
								</>
							) : (
								<>
									<li className={"nav-item"}><Link className={"link"} to="/login"> Login</Link></li>
									<li className={"nav-item"}><Link className={"link"} to="/signup"> Sign-Up</Link></li>
								</>
							)}
						</ul>
					
					</div>
				</div>
			</nav>
			
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/map" element={<ProtectedRoute><WorldMap /></ProtectedRoute>}/>
				<Route path="/logout" element={<Logout />}></Route>
				<Route path="/farm" element={<ProtectedRoute><Farm /></ProtectedRoute>}/>
				<Route path="/gates" element={<ProtectedRoute><Gates /></ProtectedRoute>}/>
				<Route path="/side-path" element={<ProtectedRoute><SidePath /></ProtectedRoute>}/>
				<Route path="/city" element={<ProtectedRoute><City /></ProtectedRoute>}/>
				<Route path="/village" element={<ProtectedRoute><Village /></ProtectedRoute>}/>
				<Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>}/>
			</Routes>
		</div>
	);
	
}
