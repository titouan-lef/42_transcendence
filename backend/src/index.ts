import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookies from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from "@fastify/static";
import { initDB } from "./database/init.js";
import { addNewUser, UpdateUserBody, updateUserInfos } from "./user_management/create_account.js";
import { connectUser, disconnectUser, changePicture, changeTheme } from "./user_management/connect_user.js";
import { newAIGame, newGame, newLocalGame, waitForGame } from "./game/web_sockets/connection.js";
import { getFriendList, newFriend, removeFriend } from "./user_management/friends.js";
import { disable2FA, enable2FA, verify2FA } from "./security/2FA.js";
import { rejectGuest, verifyAuth } from "./security/JWT.js";
import { GameOptions } from "./game/settings/GameSettings.js";
import { getUserInfos, getUserNick } from "./user_management/user_infos.js";
import { geCurrentSeasonInfo, getPlayerStats, UserDashboardInfoBody } from "./user_management/dashboard.js";
import { manageOnlineStatus } from "./user_management/online_status.js";
import { getHistory } from "./user_management/history.js";
import { getSeasonStats } from "./tournament/seasons.js";
import { ThemeBody, UserBody } from "#shared/HTTP.js";
import { matchmaking } from "./tournament/matchmaking/matchmaking.js";
import { blockchainManagement } from "./database/web3/contract_service.js";

const APP = fastify({
	bodyLimit: 2 * 1024 * 1024 // 2 MB
});

/**
* Cross-Origin Resource Sharing, is a security mechanism implemented by web browsers
*   to control how resources on a web server can be requested from a domain
*   other than the one serving the web page.
* Without CORS, a browser would block frontend apps from calling the backend.
*/

// Since we are now using cookies the line `APP.register(fastifyCors, { origin: "*", credentials: true });` is no more valid
// because the "*" is messing up the cookies so it is now dynamicly allowed
APP.register(fastifyCors, {
	origin: (origin, cb) => cb(null, true), // allow all origins dynamically
	credentials: true, // allow cookies
});
APP.register(fastifyCookies);
APP.register(fastifyWebsocket);
APP.register(fastifyMultipart, {
	limits: {
		fileSize: 2 * 1024 * 1024 // 2 MB
	}
});
APP.register(fastifyStatic, {
	root: "/app/backups/pictures/",
	prefix: "/pictures/"
});

//////////////////////////////////
// --- HTTPS route handlers --- //
//////////////////////////////////

// --- Users ---
APP.post("/api/user/new_user", addNewUser);
APP.post<{ "Body": UpdateUserBody }>("/api/user/update_user", { preHandler: [verifyAuth, rejectGuest] }, updateUserInfos);
APP.get("/api/user/get_user", { preHandler: verifyAuth }, getUserInfos);
APP.post<{ Body: UserBody }>("/api/user/get_nick", getUserNick);
APP.post("/api/user/login", connectUser);
APP.get("/api/user/logout", { preHandler: [verifyAuth, rejectGuest] }, disconnectUser);
APP.post("/api/user/change_picture", { preHandler: [verifyAuth, rejectGuest] }, changePicture);
APP.post<{ Body:ThemeBody }>("/api/user/change_theme", { preHandler: [verifyAuth, rejectGuest] }, changeTheme);

// --- 2FA ---
APP.post("/api/user/secure", verify2FA);
APP.get("/api/user/enable-secure", { preHandler: [verifyAuth, rejectGuest] }, enable2FA);
APP.get("/api/user/disable-secure", { preHandler: [verifyAuth, rejectGuest] }, disable2FA);

// --- Friends ---
APP.post("/api/friends/list", getFriendList);
APP.post<{ Body: UserBody }>("/api/friends/add", { preHandler: [verifyAuth, rejectGuest] }, newFriend);
APP.post<{ Body: UserBody }>("/api/friends/remove", { preHandler: [verifyAuth, rejectGuest] }, removeFriend);

// --- Games ---
APP.post<{ Body: GameOptions }>("/api/game/local_game", { preHandler: verifyAuth }, newLocalGame);
APP.post<{ Body: GameOptions }>("/api/game/ai_game", { preHandler: verifyAuth }, newAIGame);

// --- Dashboards ---
APP.post<{ Body: UserDashboardInfoBody }>("/api/user/dashboard", { preHandler: verifyAuth }, getPlayerStats);
APP.post<{ Body: UserBody }>("/api/user/history", { preHandler: verifyAuth }, getHistory);
APP.get("/api/season", geCurrentSeasonInfo);
APP.get("/api/season/:id", getSeasonStats);

/**
 * Register plugins like `fastifyCors` or `fastifyCookies` globally, Fastify applies those preHandlers and hooks immediately.
 * For WebSocket routes, this can break the upgrade request, because WS upgrade requests are special HTTP GETs:
 * (they must get a 101 Switching Protocols response).
 * By wrapping the WebSocket route in a register, we are creating a separate encapsulated context where Global hooks don’t interfere with the WebSocket upgrade.
 */
// --- Web Socket route handlers ---
APP.register(() => {
	APP.get("/ws/waiting", { websocket: true }, waitForGame);
	APP.get('/ws/:id', { websocket: true }, newGame);
	APP.get('/ws/online', { websocket: true }, manageOnlineStatus);
});

// --- Start server ---
async function start(): Promise<void> {
	try {
		console.log(`Backend running !`);
		blockchainManagement();
		matchmaking();
		await initDB(); // initialize DB before server
		await APP.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();
