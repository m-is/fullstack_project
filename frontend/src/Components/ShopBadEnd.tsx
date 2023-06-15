import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo } from "@/Services/RecoilState.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecoilState, useRecoilState } from "recoil";

export const ShopBadEnd = () => {
	const [showWindow, setShowWindow] = useState(true);
	const navigate = useNavigate();
	const serverIP = import.meta.env.API_HOST;
	const serverPort = import.meta.env.PORT;
	const auth = useAuth();
	const [locations, setLocations] = useRecoilState(locInfo);
	const [inventory, setInventory ] = useRecoilState(invenInfo);
	
	const serverUrl = `http://${serverIP}:${serverPort}`;
	
	const onClick = () => {
		navigate("/");
		auth.handleLogout();
		setShowWindow(false);
	};
	
	useEffect( () =>{
		const gameover = async () => {
			await httpClient.put(`/gameover`,{email:auth.userEmail})
				.then((response) => {
					console.log(response.status);
				})
				.catch(err => {
					console.error(err);
				});
		};
		
		setLocations([]);
		setInventory([]);
		gameover();
	},[auth.userEmail]);
	
	return (
		<>
			{showWindow ? (
					<div className={"end"}>
						<img src={"shop_bad_end.png"} id={"shop-end-img"} alt={"A photo of the shopkeeper bad ending"}/>
						<p className={"ending-box"}>You attempt to steal the sword from the mumbling shopkeeper. He doesn't seem to notice but as you retreat a figure emerges from the doorway... and then another... and another...
							You are suddenly surrounded by beings who all look exactly alike... exactly like the shopkeeper. You never make it out of the shop, and you're never heard from again.
							You have achieved the BAD ENDING</p>
						<input type="submit" value="Close" onClick={onClick} />
					</div>)
				: null }
		</>
	);
};
