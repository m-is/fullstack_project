import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { playerInfo } from "@/Services/RecoilState.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const Farm = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [items, setItems] = useState([]);
	const [visited, setVisited ] = useState(false);
	const [player, setPlayer] = useRecoilState(playerInfo);
	
	
	useEffect( () => {
		const items = [];
		if (player.inventory) {
			player.inventory.forEach((item) => {
				const values = Object.values(item);
				items.push(values[1]);
			});
		}
		
		if(player.locations) {
			player.locations.forEach((location) =>{
				if(location.name==="farm" && location.visited===true){
					setVisited(true);
				}
			});
		}
		
		setItems(items);
	}, [player]);
	
	
	const onShovelClick = () => {
		const newInventory = player.inventory;
		httpClient.post("/inventory",{email:auth.userEmail, item:"shovel"})
			.then( (response) =>{
				newInventory.push(response.data);
				console.log(response.status);
			})
			.catch(err =>{
				console.error(err);
			});
		if(!items.includes("shovel")){
			items.push("shovel");
		}
		const setValues= (newPlayer) => setPlayer( (player) => player = newPlayer);
		
		const newPlayer = {
			email: auth.userEmail,
			locations: player.locations,
			inventory: newInventory,
		};
		setValues(newPlayer);
		
		setItems(items);
	};
	
	const onLookAround = () => {
		httpClient.put("/location",{location:"farm",email:auth.userEmail})
			.then( (response) =>{
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		
		
		setVisited(true);
	};
	
	const onLookAtSign = () => {
		httpClient.post("location", {location:"gates", email:auth.userEmail})
			.then( (response) =>{
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		
	};
	
	const navigateToMap = () => {
		const path = "/map";
		navigate(path);
	};
	
	
	
	//Grab Shovel should have onClick=OnShovelClick, but backend isn't working
	return(
		<div className={"farm-page background"}>
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			{ visited ? (
				<>
					{items.includes("shovel") ? null :
						<button id={"grab-shovel"} onClick={onShovelClick}>Grab Shovel</button>
					}
					<button id={"look-at-sign"} onClick={onLookAtSign}>Look At Sign</button>
				</>
				) : null}
				<button className={"leave-button"} onClick={navigateToMap}>Leave</button>
		</div>
	);
	
};
