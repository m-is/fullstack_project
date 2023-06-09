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
	
	const title = String.raw`
╭━━━━┳━━━┳━━━┳━━━╮
╰━━╮━┃╭━╮┃╭━╮┃╭━╮┃
╱╱╭╯╭┫┃╱┃┃╰━╯┃╰━╯┃
╱╭╯╭╯┃┃╱┃┃╭╮╭┫╭━━╯
╭╯━╰━┫╰━╯┃┃┃╰┫┃
╰━━━━┻━━━┻╯╰━┻╯`;
	return (
		<div>
			<h1><pre> {title} </pre></h1>
		</div>
	);
	
}

export function Description() {
	return (
		<div>
			<h2>WELCOME TO ZORP</h2>
			<p>ZORP is an online point and click adventure game set in a fantasy world</p>
			<p>To play sign up for an account by clicking the "SIGN-UP" button above</p>
		</div>
	);
	
}
