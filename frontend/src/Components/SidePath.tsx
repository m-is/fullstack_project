import { Dialogue } from "@/Components/DialogueBox.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo, playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const SidePath = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [player, setPlayer] = useRecoilState(playerInfo);
	const [inventoryInfo, setInventoryInfo ] = useRecoilState(invenInfo);
	const [locationInfo, setLocationInfo] = useRecoilState(locInfo);
	const [items, setItems] = useState([]);
	const [visited, setVisited ] = useState(false);
	const [dialogue_around, setDialogueAround ] = useState(false);
	const lookAroundDescription = "Further down the wall you notice the ground going from dense hardpacked dirt to softer silt." +
		" At one point in the wall you notice the dirt is especially soft and the wall's foundation doesn't look too deep. " +
		"If you had a shovel you could probably dig enough space to crawl below the wall.";
	
	useEffect( () => {
		const items = [];
		if (inventoryInfo) {
			inventoryInfo.forEach((item) => {
				const values = Object.values(item);
				items.push(values[1]);
			});
		}
		
		if(locationInfo) {
			locationInfo.forEach((location) =>{
				if(location.name==="gates" && location.visited===true){
					setVisited(true);
				}
			});
		}
		
		setItems(items);
	}, [player, locationInfo, inventoryInfo]);
	
	const onLookAround = () => {
		httpClient.put("/location", { location: "side-path", email: auth.userEmail })
			.then((response) => {
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		
		setDialogueAround(true);
		setVisited(true);
	};
	
	const navigateToGates = () => {
		navigate(-1);
	};
	
	const onDigInteraction = () => {
		httpClient.post("/location", { location: "city", email:auth.userEmail})
			.then((response) => {
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		const path = "/city";
		navigate(path);
	};
	
	
	return(
		<div className={"path-page background"}>
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			{ items.includes("shovel") ? <button className={"dig-interaction"} onClick={onDigInteraction}>Use Shovel</button>	: null}
			<button className={"leave-button"} onClick={navigateToGates}>Go back</button>
		</div>
	);
};
