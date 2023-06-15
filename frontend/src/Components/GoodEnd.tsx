import { useState } from "react";
import goodEndImage from "../assets/images/good_end.png";

export const GoodEnd = () => {
	const [showWindow, setShowWindow] = useState(true);
	const onClick = () => setShowWindow(false);
	
	return (
		<>
			{showWindow ? (
				<div className={"end"}>
					<img src={goodEndImage} id={"end-img"} alt={"A photo of the good ending"}/>
					<p className={"ending-text"}>You have found your way out of the land where the Sun has died and the Moon scathes the earth.
						You have achieved the GOOD ENDING</p>
					<input type="submit" value="Close" onClick={onClick} />
				</div>)
				: null }
		</>
	);
};
