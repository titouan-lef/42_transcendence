interface HelloResponse {
	msg: string;
}

declare const API_URL: string; // just telling the compiler that API_URL will exists during execution

function hello(): void {
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

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("btn-hello")?.addEventListener("click", hello);
	document.getElementById("btn-test")?.addEventListener("click", test);
});