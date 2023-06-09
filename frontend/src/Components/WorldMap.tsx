//Add auth check to see which locations the user has discovered and display only those
//Boot player from here if no auth
//If player tries to visit undiscovered location give them a "you are lost" page


import { useAuth } from "@/Services/Auth.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import farmIcon from "../assets/images/farm_icon.png";
import gatesIcon from "../assets/images/gates_icon.png";
import worldMap from "../assets/images/world_map.png";


export const WorldMap = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const[locations,setLocations] = useState();
	const[map, setMap] = useState([]);
	
	useEffect( () => {
		
		console.log(auth);
		const getLocations = async () => {
			const locationsRes = await axios({
				method: 'search',
				url: 'http://localhost:8080/location',
				data:{ userEmail: auth.userEmail }
				}
			);
		
			return locationsRes.data;
		};
		
		getLocations().then(setLocations);
		
	},[auth.userEmail]);
	
	useEffect( () => {
		if(locations!=undefined){
			// @ts-ignore
			locations.forEach((location) =>{
				const values = Object.values(location);
				map.push(values[1]);
			});
		}
		setMap(map);
	},[locations]);
	
	const navigateToFarm = () =>{
		const path = "/farm";
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
		<div className={"world-map"}>
			<button id={"farm-icon"}><img  className={"map-icon"} src={farmIcon} alt={"Icon for farm location"} onClick={navigateToFarm} /></button>
			<button id={"gates-icon"}><img className={"map-icon"} src={gatesIcon} alt={"Icon for town gates location"} onClick={navigateToGates} /></button>
		</div>
	);
};



export function TownCenterIcon() {
	return(
		//add onClick event to link to town center page/component
		<img src={""} alt={"Icon for town center location"}/>
	);
}
