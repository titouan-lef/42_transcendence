interface HelloResponse {
	msg: string;
}

declare const API_URL: string; // just telling the compiler that API_URL will exists during execution

export function hello(): void {
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

export function test(): void {
	fetch(`${API_URL}/api/test`)
		.then((res) => res.json())
		.then((data: HelloResponse) => {
			const container = document.getElementById(`print-content`);
			if (container)
				container.innerHTML = `<p>Backend says: ${data.msg}</p>`;
		})
		.catch((err) => console.error(err));
}

// document.addEventListener("DOMContentLoaded", () => {
// 	document.getElementById("btn-hello")?.addEventListener("click", hello);
// 	document.getElementById("btn-test")?.addEventListener("click", test);
// });
