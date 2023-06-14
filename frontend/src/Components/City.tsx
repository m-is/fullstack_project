import { Dialogue } from "@/Components/DialogueBox.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { invenInfo, locInfo, playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const City = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [items, setItems] = useState([]);
	const [visited, setVisited] = useState(false);
	const [player, setPlayer] = useRecoilState(playerInfo);
	const [inventoryInfo, setInventoryInfo] = useRecoilState(invenInfo);
	const [locationInfo, setLocationInfo] = useRecoilState(locInfo);
	
	const [dialogue_around, setDialogueAround] = useState(false);
	const [dialogue_mysterious_woman, setDialogueWoman ] = useState(false);
	const [dialogue_coin, setDialogueCoin ] = useState(false);
	
	const lookAroundDescription = "The city center is bustling with destitute and haggard citizens. The main pavillion is lined with buildings that look abandoned and the occasional street vendor selling undiscernable objects." +
		" An aged woman wearing mysterious clothing catches your eye sitting calmly watching the crowd. There's a large fountain in the center of the pavillion with coins littered around deep in the water.";
	const mysteriousWomanDialogue = `You walk up to the old woman to begin a conversation but she speaks before you, "You're not from here. Things aren't right in this city, you should leave and make your way north as soon as possible.
	 There's a mine nested at the foot of the mountains, it's a passage through to lands the Sun hasn't forgotten.
	 Whatever you do, do not enter the alleyway between the old inn and the city hall, no one who's entered has ever left." You try to question her further but she remains mute.`;
	const coinDialogue = "You jump into the fountain to grab one of the coins scattered at the bottom. For a moment everyone the entire pavillion stops and watches you, but the second you step out of the fountain they turn as if nothing happened. You've acquired a shiny coin.";
	
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
	
	const navigateToMap = () =>{
		const path = "/path";
		navigate(path);
	};
	
	const onLookAround = () => {
			httpClient.put("/location", {location:"city", email: auth.userEmail})
				.then((response) => {
					console.log(response.status);
				})
				.catch(err => {
					console.error(err);
				});
			setDialogueAround(true);
	};
	
	const onCoinClick = () => {
		const newInventory = inventoryInfo;
		
		httpClient.post("/inventory",{email:auth.userEmail, item:"coin"})
			.then( (response) =>{
				newInventory.push(response.data);
				console.log(response.status);
			})
			.catch(err =>{
				console.error(err);
			});
		
		if(!items.includes("coin")){
			items.push("coin");
		}
		const setValues= (newInventory) => setInventoryInfo( (inventory) => inventory = newInventory);
		
		setValues(newInventory);
		
		setDialogueCoin(true);
		setItems(items);
	};
	
	const onSpeakToWoman = () => {
		setDialogueWoman(true);
	};
	
	
	return(
		<div className={"background city-page"}>
			{ dialogue_mysterious_woman && <Dialogue text={`${mysteriousWomanDialogue}`}/>}
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			{ dialogue_coin && <Dialogue text={`${coinDialogue}`}/>}
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			<button className={"leave-button"} onClick={navigateToMap}>Leave</button>
			{ visited ? (
				<>
					{items.includes("coin") ? null :
						<button id={"grab-coin"} onClick={onCoinClick}>Grab Shovel</button>
					}
					<button id={"talk-to-woman"} onClick={onSpeakToWoman}>Look At Sign</button>
				</>
			) : null
			}
		</div>
	);

};
