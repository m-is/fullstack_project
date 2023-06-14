import { Dialogue } from "@/Components/DialogueBox.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo, playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const Gates = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [items, setItems] = useState([]);
	const [visited, setVisited ] = useState(false);
	const [player, setPlayer] = useRecoilState(playerInfo);
	const [inventoryInfo, setInventoryInfo ] = useRecoilState(invenInfo);
	const [locationInfo, setLocationInfo] = useRecoilState(locInfo);
	
	const [dialogue_around, setDialogueAround ] = useState(false);
	const [dialogue_guard, setDialogueGuard ] = useState(false);
	const guardDialogue = `"Sorry gates closed, no outsiders are allowed in. Ever since the Sun died out we've been getting
	more and more outsiders and we can't keep up anymore. There's a village half a day to the west if you need lodging."`;
	const lookAroundDescription = "You approach the gates to the town. The town is surrounded by imposing dry laid stone walls." +
		"The gate doors are shut tight, a pair of restless and dour guards stand on either side. " +
		"When you look down you notice there's a lightly beaten path that cuts right and continues further along the wall.";
	
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
		httpClient.put("/location", { location: "gates", email: auth.userEmail })
			.then((response) => {
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		
		httpClient.post("/location", {location:"side-path", email: auth.userEmail})
			.then((response)=>{
				console.log(response.status);
			})
			.catch(err=>{
				console.error(err);
			});
		
		setDialogueAround(true);
		setVisited(true);
	};
	
	const onSpeakToGuard = () => {
		httpClient.post("/location", {location:"village", email: auth.userEmail})
			.then((response)=>{
				console.log(response.status);
			})
			.catch(err=>{
				console.error(err);
			});
		setDialogueGuard(true);
	};
	
	const onTakePath = () => {
		const path = "/side-path";
		navigate(path);
	};
	
	const navigateToMap = () => {
		const path = "/map";
		navigate(path);
	};
	
	
	//Add button to speak to guards and to travel down the path
	return(
		<div className={"gates-page background"}>
			{ dialogue_guard && <Dialogue text={`${guardDialogue}`}/>}
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			<button className={"leave-button"} onClick={navigateToMap}>Leave</button>
			{ visited ? (
				<>
					<button id={"guard-dialogue"} onClick={onSpeakToGuard}>Speak To Guard</button>
					<button id={"side-path"} onClick={onTakePath}>Follow Side-Path</button>
				</>
			) : null}
		</div>
	);
	
};
