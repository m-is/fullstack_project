//Add auth check to see which locations the user has discovered and display only those
//Boot player from here if no auth
//If player tries to visit undiscovered location give them a "you are lost" page

import { useAuth } from "@/Services/Auth.tsx";
import { playerInfo } from "@/Services/RecoilState.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import farmIcon from "../assets/images/farm_icon.png";
import gatesIcon from "../assets/images/gates_icon.png";
import worldMap from "../assets/images/world_map.png";


export const WorldMap = () => {
	const navigate = useNavigate();
	const [player, setPlayer ] = useRecoilState(playerInfo);
	const [locationList, setLocationList] = useState([]);
	const [inventoryList, setInventoryList] = useState([]);
	
	const auth = useAuth();
	
	const[map, setMap] = useState([]);
	
	useEffect( () => {
		
		const getLocations = async () => {
			const locationsRes = await axios({
				method: 'search',
				url: 'http://localhost:8080/location',
				data:{ userEmail: auth.userEmail }
				}
			);
			
			
			return locationsRes.data;
		};
		
		getLocations().then(setLocationList);
		},[auth.userEmail]);
	
	useEffect( () => {
		
		const getInventory = async () => {
			const inventoryRes = await axios({
				method: 'search',
				url: 'http://localhost:8080/inventory',
				data: { userEmail: auth.userEmail }
			});
			
			return inventoryRes.data;
		};
		
		getInventory().then(setInventoryList);
	},[auth.userEmail]);
	
	useEffect( () => {
		const setValues= (newPlayer) => setPlayer( (player) => player = newPlayer);
		const newPlayer = {
			email: auth.userEmail,
			locations: locationList,
			inventory: inventoryList,
		};
		setValues(newPlayer);
		
		console.log(player);
	},[auth.userEmail,locationList,inventoryList]);
	
	
	const navigateToFarm = () =>{
		const path = "/farm";
		/*
		let visited = false;
		locations.forEach((location) =>{
			if(location.name === "farm"){
				visited = location.visited;
			}
		});
		
		 */
		navigate(path);
	};
	
	const navigateToGates = () =>{
		const path = "/gates";
		navigate(path);
	};
	
	
	
	/*
	return (
		<div>
			{ map.includes("farm") ? (
				<FarmIcon />
			) : null }
			{ map.includes("castleGate") ? (
				<CastleGateIcon />
			) : null }
			{ map.includes("townCenter") ? (
				<TownCenterIcon />
			) : null }
		</div>
	);
	
	 */
	return (
		
		<div className={"world-map background"}>
				<button id={"farm-icon"}><img  className={"map-icon"} src={farmIcon} alt={"Icon for farm location"} onClick={navigateToFarm} /></button>
			{ map.includes("gates") ? (
				<button id={"gates-icon"}><img className={"map-icon"} src={gatesIcon} alt={"Icon for town gates location"} onClick={navigateToGates} /></button>
			) : null }
			
		</div>
	);
};



export function TownCenterIcon() {
	return(
		//add onClick event to link to town center page/component
		<img src={""} alt={"Icon for town center location"}/>
	);
}
