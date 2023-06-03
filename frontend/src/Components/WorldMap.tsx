//Add auth check to see which locations the user has discovered and display only those
//Boot player from here if no auth
//If player tries to visit undiscovered location give them a "you are lost" page


import { useAuth } from "@/Services/Auth.tsx";
import axios from "axios";
import { useEffect, useState } from "react";

export const WorldMap = () => {
	const auth = useAuth();
	
	const[locations,setLocations] = useState();
	const[map, setMap] = useState([]);
	
	
	useEffect( () => {
		const getLocations = async () => {
			const locationsRes = await axios({
				method: 'search',
				url: 'http://localhost:8080/location',
				data:{ userId: auth.userId }
				}
			);
		
			return locationsRes.data;
		};
		
		getLocations().then(setLocations);
	},[auth.userId]);
	
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
	
	
	
	
	return (
		<div>
			{ map.includes("Farm") ? (
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
};

export function FarmIcon(){
	return(
		//add onClick event to link to farm page/component
		<img src={""} alt={"Icon for farm location"} />
	);
}

export function CastleGateIcon() {
	return(
		//add onClick event to link to castle gate page/component
		<img src={""} alt={"Icon for castle gate location"}/>
	);
}

export function TownCenterIcon() {
	return(
		//add onClick event to link to town center page/component
		<img src={""} alt={"Icon for town center location"}/>
	);
}
