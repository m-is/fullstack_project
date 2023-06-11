import { Dialogue } from "@/Components/DialogueBox.tsx";
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
	const [dialogue_around, setDialogueAround ] = useState(false);
	const [dialogue_sign, setDialogueSign ] = useState(false);
	const [dialogue_shovel, setDialogueShovel ] = useState(false);
	const lookAroundDescription =
		"Standing near the road, you look around to see a barn and field in the distance. " +
		"There's a small road-sign shortly down the road and you notice a shovel propped up against a tree close-by.";
	const shovelDescription =
		"You grab the medium sized shovel and strap it to the side of your rucksack";
	const signDescription= "You walk down the road to the sign and read it. " +
		"You discover the name of this farm is Moon Harvest Homestead and that there is a town called Rensworth to the north." +
		"The sign details a third location, but the text is too worn to read.";
	
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
		
		setDialogueShovel(true);
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
		
		setDialogueAround(true);
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
		
		setDialogueSign(true);
	};
	
	const navigateToMap = () => {
		const path = "/map";
		navigate(path);
	};
	
	
	
	//Grab Shovel should have onClick=OnShovelClick, but backend isn't working
	return(
		<div className={"farm-page background"}>
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			{ dialogue_sign && <Dialogue text={`${signDescription}`}/>}
			{ dialogue_shovel && <Dialogue text={`${shovelDescription}`}/>}
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
