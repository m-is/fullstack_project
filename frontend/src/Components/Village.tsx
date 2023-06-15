import { Dialogue } from "@/Components/DialogueBox.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo, playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const Village = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [player, setPlayer] = useRecoilState(playerInfo);
	const [inventoryInfo, setInventoryInfo ] = useRecoilState(invenInfo);
	const [locationInfo, setLocationInfo] = useRecoilState(locInfo);
	const [items, setItems] = useState([]);
	const [visited, setVisited ] = useState(false);
	const [dialogue_around, setDialogueAround ] = useState(false);
	const lookAroundDescription = "You enter a shabby village. It's eerily quiet and none of the houses look like they've had habitants for many years." +
		" Oddly, there's a shop open near the village entrance, and you can hear someone loudly mumbling to themselves within.";
	
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
				if(location.name==="village" && location.visited===true){
					setVisited(true);
				}
			});
		}
		
		setItems(items);
	}, [player, locationInfo, inventoryInfo]);
	
	const onLookAround = () => {
		httpClient.put("/location", { location: "village", email: auth.userEmail })
			.then((response) => {
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		
		setDialogueAround(true);
		setVisited(true);
	};
	
	const navigateToMap = () => {
		navigate("/map");
	};
	
	const navigateToShop = () => {
		navigate("/shop");
	};
	
	
	return(
		<div className={"village-page background"}>
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			<button className={"leave-button"} onClick={navigateToMap}>Go back</button>
			{ visited ? <button id={"enter-shop"} onClick={navigateToShop}>Enter Shop</button> : null }
		</div>
	);
};
