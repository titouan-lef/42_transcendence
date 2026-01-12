import { FastifyRequest } from "fastify";
import { verifyAuthWS } from "../game/web_sockets/connection.js";
import { WebSocket } from "ws";

const CONNETED_USERS = new Set<string>();

function isUserConnected(username: string): boolean {
	return CONNETED_USERS.has(username);
}

function addUserToConnectedList(username: string): void {
	CONNETED_USERS.add(username);
	console.log("Players currently connected :", CONNETED_USERS);
}

function removeUserToConnectedList(username: string): void {
	CONNETED_USERS.delete(username);
	console.log("Players currently connected :", CONNETED_USERS);
}

async function manageOnlineStatus(socket: WebSocket, req: FastifyRequest): Promise<void> {
	const user = await verifyAuthWS(socket, req);
	if (!user)
		return;

	addUserToConnectedList(user);
	socket.on("close", () => removeUserToConnectedList(user));

}

export { isUserConnected, manageOnlineStatus };
