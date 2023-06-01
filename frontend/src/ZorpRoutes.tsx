import { Home } from "@/Components/Home.tsx";
import { Login } from "@/Components/Login.tsx";
import { SignUp } from "@/Components/SignUp.tsx";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";

export function ZorpRouter() {
	return (
		<div className={"doggrfancy"}>
			<nav className="bg-blue-800 rounded-b shadow-lg mb-4">
				<div className="navbar justify-center">
					<div className={"navbar-center lg:flex"}>
						
						<ul className={"menu menu-horizontal"}>
							<li><Link to="/">Home</Link></li>
							<li><Link to="/login"> Login</Link></li>
							<li><Link to="/signup"> Sign-Up</Link></li>
						</ul>
					
					</div>
				</div>
			</nav>
			
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				
			</Routes>
		</div>
	);
	
}
