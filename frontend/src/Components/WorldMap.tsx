//Add auth check to see which locations the user has discovered and display only those
//Boot player from here if no auth
//If player tries to visit undiscovered location give them a "you are lost" page


export const Map = () => {
	return (
		<div>
			<FarmIcon />
			<CastleGateIcon />
			<TownCenterIcon />
		</div>
	);
};

export function FarmIcon(){
	return(
		//add onClick event to link to farm page/component
		<img src={""} alt={"Icon for farm location"} />
	);
}

export function CastleGateIcon() {
	return(
		//add onClick event to link to castle gate page/component
		<img src={""} alt={"Icon for castle gate location"}/>
	);
}

export function TownCenterIcon() {
	return(
		//add onClick event to link to town center page/component
		<img src={""} alt={"Icon for town center location"}/>
	)
}
