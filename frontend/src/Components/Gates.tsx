import { Dialogue } from "@/Components/DialogueBox.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { playerInfo } from "@/Services/RecoilState.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

export const Gates = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [items, setItems] = useState([]);
	const [visited, setVisited ] = useState(false);
	const [player, setPlayer] = useRecoilState(playerInfo);
	
	const [dialogue_around, setDialogueAround ] = useState(false);
	const lookAroundDescription = "You approach the gates to the town. The town is surrounded by imposing dry laid stone walls." +
		"The gate doors are shut tight, a pair of restless and dour guards stand on either side. " +
		"When you look down you notice there's a lightly beaten path that cuts right and continues further along the wall.";
	
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
	
	const onLookAround = () => {
		httpClient.put("/location", { location: "gates", email: auth.userEmail })
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
		const path = "/map";
		navigate(path);
	};
	
	
	//Add button to speak to guards and to travel down the path
	return(
		<div className={"gates-page background"}>
			{ dialogue_around && <Dialogue text={`${lookAroundDescription}`}/>}
			<button className={"look-around"} onClick={onLookAround} >Look Around</button>
			<button className={"leave-button"} onClick={navigateToMap}>Leave</button>
		</div>
	);
	
};
