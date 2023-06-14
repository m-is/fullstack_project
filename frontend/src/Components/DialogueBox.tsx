import { useState } from "react";
import { useLocation } from "react-router-dom";


//takes text as an argument as well as a boolean to decide whether it should be visible on render or not
export const Dialogue = (text) => {
	const [showDialogue, setShowDialogue] = useState(true);
	const onClick = () => setShowDialogue(false);
	return (
		<>
		{ showDialogue ? (
			<div className={"dialogue-box"}>
				<DialogueBox {...text}/>
				<input type="submit" value="Close" onClick={onClick} /></div>
			) : null }
		</>
	);
};

const DialogueBox = (text) => {
	return(
		<div >
			<p>{`${text.text}`}</p>
		</div>
	);
};
