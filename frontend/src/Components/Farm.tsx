import { useAuth } from "@/Services/Auth.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Farm = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const [inventory, setInventory] = useState();
	const [items, setItems] = useState([]);
	
	useEffect( () => {
		
		console.log(auth);
		const getInventory = async () => {
			const inventoryRes = await axios({
					method: 'search',
					url: 'http://localhost:8080/inventory',
					data:{ userEmail: auth.userEmail }
				}
			);
			
			return inventoryRes.data;
		};
		
		getInventory().then(setInventory);
		
	},[auth.userEmail]);
	
	useEffect( () => {
		if(inventory!=undefined){
			// @ts-ignore
			inventory.forEach((item) =>{
				const values = Object.values(item);
				items.push(values[1]);
			});
		}
		setItems(items);
	},[inventory]);
	
	const onShovelClick = () => {
		httpClient.post("/inventory",{email:auth.userEmail, item:"shovel"})
			.then( (response) =>{
				console.log(response.status);
			})
			.catch(err =>{
				console.error(err);
			});
	};
	
	const navigateToMap = () => {
		const path = "/map";
		navigate(path);
	};
	
	//Grab Shovel should have onClick=OnShovelClick, but backend isn't working
	return(
		<div id={"farm-interactions"}>
			<button >Grab Shovel</button>
			<button onClick={navigateToMap}>Leave</button>
		</div>
	);
	
};
