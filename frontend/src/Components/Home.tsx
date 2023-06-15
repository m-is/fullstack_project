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
			<h3>Story</h3>
			<p>You have been exiled from your village in the eastern plains. You were sent through the western forests to a foreign land. A foreign land which you had heard many stories about when you were young.
				According to those stories the kingdom of the western land committed grave heresies upon the God of the Sun. The God of the Sun abandoned them and a cursed Moon took it's place, casting the entire land
			in a sharp pale glow. When you emerge from the forest, you discover the stories are true, the entire land is pitch black and eerie white.... You need to get out of here quick...</p>
		</div>
	);
	
}
