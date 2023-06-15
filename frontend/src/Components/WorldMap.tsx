//Add auth check to see which locations the user has discovered and display only those
//Boot player from here if no auth
//If player tries to visit undiscovered location give them a "you are lost" page

import { GoodEnd } from "@/Components/GoodEnd.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo, playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import farmIcon from "../assets/images/farm_icon.png";
import gatesIcon from "../assets/images/gates_icon.png";
import cityIcon from "../assets/images/city_icon.png";
import villageIcon from "../assets/images/village_icon.png";
import minesIcon from "../assets/images/mines_icon.png";

export const WorldMap = () => {
	const navigate = useNavigate();
	const [player, setPlayer ] = useRecoilState(playerInfo);
	const [locationList, setLocationList] = useState([]);
	const [inventoryList, setInventoryList] = useState([]);
	const [locationInfo, setLocationInfo ] = useRecoilState(locInfo);
	const [inventoryInfo, setInventoryInfo ] = useRecoilState(invenInfo);
	const [goodEnd, setGoodEnd ]	= useState(false);
	
	const auth = useAuth();
	
	const[map, setMap] = useState([]);
	
	useEffect( () => {
		
		const getLocations = async () => {
			const locationsRes = await httpClient.search("/location", {userEmail:auth.userEmail});
			return locationsRes.data;
		};
		
		const setLocationValues = (newLocation) => setLocationInfo( (location) => location = newLocation);
		
		getLocations().then(setLocationValues);
		
		}, [auth.userEmail]);
	
	useEffect( () => {
		
		const getInventory = async () => {
			const inventoryRes = await httpClient.search("/inventory",{ userEmail: auth.userEmail });
			return inventoryRes.data;
		};
		
		const setInventoryValues = (newInventory) => setInventoryInfo( (inventory) => inventory = newInventory);
		
		getInventory().then(setInventoryValues);
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
	
	useEffect(  () => {
		const map= [];
		if(locationInfo) {
			locationInfo.forEach((location) => {
				const value = Object.values(location);
				map.push(value[1]);
			});
		}
		
		setMap(map);
	},[locationInfo]);
	
	
	
	const navigateToFarm = () =>{
		const path = "/farm";
		navigate(path);
	};
	
	const navigateToGates = () =>{
		const path = "/gates";
		navigate(path);
	};
	
	const navigateToCity = () => {
		const path = "/city";
		navigate(path);
	};
	
	const navigateToVillage = () =>{
		navigate("/village");
	};
	
	const navigateToMines = () =>{
		setGoodEnd(true);
	};
	
	return (
		
		<div className={"world-map background"}>
			{ goodEnd && <GoodEnd />}
				<button id={"farm-icon"}><img  className={"map-icon"} src={farmIcon} alt={"Icon for farm location"} onClick={navigateToFarm} /></button>
			{ map.includes("gates") ? (
				<button id={"gates-icon"}><img className={"map-icon"} src={gatesIcon} alt={"Icon for town gates location"} onClick={navigateToGates} /></button>
			) : null }
			{ map.includes("city") ? (
				<button id={"city-icon"}><img className={"map-icon"} src={cityIcon} alt={"Icon for city location"} onClick={navigateToCity} /></button>
			) : null }
			{ map.includes("village") ? (
				<button id={"village-icon"}><img className={"map-icon"} src={villageIcon} alt={"Icon for village location"} onClick={navigateToVillage} /></button>
			) : null }
			{ map.includes("mines") ? (
				<button id={"mines-icon"}><img className={"map-icon"} src={minesIcon} alt={"Icon for mines location"} onClick={navigateToMines} /></button>
			) : null }
			
		</div>
	);
};

