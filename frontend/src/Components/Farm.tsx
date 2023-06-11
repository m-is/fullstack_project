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
	const [inventory, setInventory] = useState([]);
	const [items, setItems] = useState([]);
	const [player, setPlayer] = useRecoilState(playerInfo);
	
	useEffect( () => {
		
		console.log(auth);
		const getInventory = async () => {
			const inventoryRes = await axios({
					method: 'search',
					url: 'http://localhost:8080/inventory',
					data:{ userEmail: auth.userEmail }
				}
			);
			
			return inventoryRes.data;
		};
		console.log(player);
		getInventory().then(setInventory);
		
	},[auth.userEmail]);
	
	useEffect( () => {
		if(inventory!=undefined){
			// @ts-ignore
			inventory.forEach((item) =>{
				const values = Object.values(item);
				items.push(values[1]);
			});
		}
		setItems(items);
	},[inventory]);
	
	useEffect( () => {
		const items = [];
		if (player.inventory) {
		player.inventory.forEach((item) => {
			const values = Object.values(item);
			items.push(values[1]);
		});
		}
		setItems(items);
	}, [player]);
	
	const onShovelClick = () => {
		httpClient.post("/inventory",{email:auth.userEmail, item:"shovel"})
			.then( (response) =>{
				console.log(response.status);
			})
			.catch(err =>{
				console.error(err);
			});
		if(!items.includes("shovel")){
			items.push("shovel");
		}
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
			{items.includes("shovel") ? null :
				<button id={"grab-shovel"} onClick={onShovelClick}>Grab Shovel</button>
			}
				<button id={"look-at-sign"} onClick={onLookAtSign}>Look At Sign</button>
			<button className={"leave-button"} onClick={navigateToMap}>Leave</button>
		</div>
	);
	
};
