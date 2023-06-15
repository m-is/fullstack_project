import { Dialogue } from "@/Components/DialogueBox.tsx";
import { ShopBadEnd } from "@/Components/ShopBadEnd.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo, playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const Shop = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [player, setPlayer] = useRecoilState(playerInfo);
	const [inventoryInfo, setInventoryInfo ] = useRecoilState(invenInfo);
	const [locationInfo, setLocationInfo] = useRecoilState(locInfo);
	const [items, setItems] = useState([]);
	const [visited, setVisited ] = useState(false);
	
	const [dialogue_around, setDialogueAround ] = useState(false);
	const [dialogue_buy, setDialogueBuy ] = useState(false);
	const [badEnd, setBadEnd ] = useState(false);
	
	const buyDescription = `You place the coin from the fountain on the counter, but the shopkeeper doesn't seem to react at all. After a moment you move to grab the sword, the moment you touch the sword the shopkeeper snatches
	the coin off the table with an inexplicablely quick motion. He doesn't stop mumbling the entire time. You have acquired a sword.`;
	const lookAroundDescription = `You enter the shop and are assaulted by a foul odour that stings your nostrils. The shop interior is cluttered and odd jars and trinkets line the walls and spill over the counters.
		 Nothing of value catches your eye except a sturdy looking sword propped up against a table in the corner. The shopkeeper is just an indistinguishable silhouette behind the counter, but as you enter you make out more of his mumbling, he's
		saying "One coin, one item" over and over.`;
	
	
	
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
				if(location.name==="shop" && location.visited===true){
					setVisited(true);
				}
			});
		}
		
		setItems(items);
	}, [player, locationInfo, inventoryInfo]);
	
	const onLookAround = () => {
		setDialogueAround(true);
		setVisited(true);
	};
	
	const navigateToVillage = () => {
		navigate(-1);
	};
	
	const onBuyInteraction = () => {
		httpClient.post("/inventory", { item: "sword", email:auth.userEmail})
			.then((response) => {
				console.log(response.status);
			})
			.catch(err => {
				console.error(err);
			});
		setDialogueBuy(true);
	};
	
	const onStealInteraction = () => {
			setBadEnd(true);
	};
	
	
	return(
		<div className={"shop-page background"}>
			{ badEnd && <ShopBadEnd/>}
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			{ items.includes("coin")&&(!items.includes("sword"))&&visited ? <button id={"buy-interaction"} onClick={onBuyInteraction}>Buy Sword</button>	: null}
			{ dialogue_buy && <Dialogue text={`${buyDescription}`}/>}
			{ visited&&(!items.includes("sword")) ? <button id={"steal-interaction"} onClick={onStealInteraction}>Steal Sword</button>	: null}
			<button className={"leave-button"} onClick={navigateToVillage}>Go back</button>
		</div>
	);
};
