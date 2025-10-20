interface HelloResponse {
	msg: string;
}

declare const API_URL: string; // just telling the compiler that API_URL will exists during execution

function hello(): void {
	console.log("coucou hello");
	fetch(`${API_URL}/api/hello`)
		.then((res) => res.json())
		.then((data: HelloResponse) => {
			const container = document.getElementById(`print-content`);
			if (container)
				container.innerHTML = `<p>Backend says: ${data.msg}</p>`;
		})
		.catch((err) => console.error(err));
}

function test(): void {
	fetch(`${API_URL}/api/test`)
		.then((res) => res.json())
		.then((data: HelloResponse) => {
			const container = document.getElementById(`print-content`);
			if (container)
				container.innerHTML = `<p>Backend says: ${data.msg}</p>`;
		})
		.catch((err) => console.error(err));
}

export function handleAPIEvent(): void {
	document.addEventListener("click", (event) => {
		const target = event.target;

		if (!target) {
			return ;
		} else if (target instanceof HTMLElement) {
			switch (target.id) {
				case "btn-hello":
					hello();
					break;
				case "btn-test":
					test();
					break;
				default: break;
			}
		} else {
			console.log("problem with HTMLElement");
		}
	});
}
