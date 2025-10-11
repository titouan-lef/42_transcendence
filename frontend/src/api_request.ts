interface HelloResponse {
	msg: string;
}

declare const API_URL: string; // just telling the compiler that API_URL will exists during execution

interface ServerRes {
	success: boolean;
	message: string;
}

function sendRequestToBack(endpoint: string, content: string) : void {
	fetch(`${API_URL}/${endpoint}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: content
	})
		.then(async (res) => {
			const result: ServerRes = await res.json();

			const message = result.message || "Unknown response";
			const container = document.getElementById("print-content");
			if (container)
				container.innerHTML = `<p>${message}</p>`;
			return result;
		})
		.catch((err: Error) => {
			console.error("Caught error:", err);
		});
}

export { sendRequestToBack };