export const Home = () => {
		return (
			<div>
				<Title />
				<Description />
			</div>
		);
};

export function Title() {
	//Change to better splash title, possibly image
	return <h1>ZORP</h1>;
}

export function Description() {
	return <p>There will be a description of the game and a brief introduction here</p>;
}
