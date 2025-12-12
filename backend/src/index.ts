import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookies from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from "@fastify/static";
import { initDB } from "./database/init.js";
import { addNewUser, UpdateUserBody, updateUserInfos } from "./user_management/create_account.js";
import { connectUser, disconnectUser, changePicture, getPicture, UserBody, changeTheme, ThemeBody } from "./user_management/connect_user.js";
import { isGameFound, newAIGame, newGame, newLocalGame } from "./game/web_sockets/connection.js";
import { addPlayerToMatchmakingSystem } from "./tournament/matchmaking.js";
import { getFriendList, newFriend, removeFriend } from "./user_management/friends.js";
import { disable2FA, enable2FA, verify2FA } from "./security/2FA.js";
import { verifyAuth } from "./security/JWT.js";
import { GameOptions } from "./game/settings/GameSettings.js";
import { getUserInfos } from "./user_management/user_infos.js";

const APP = fastify();

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
APP.register(fastifyMultipart);
APP.register(fastifyStatic, {
	root: "/app/pictures/",
	prefix: "/pictures/"
});

//////////////////////////////////
// --- HTTPS route handlers --- //
//////////////////////////////////

// --- Users ---
APP.post("/api/user/new_user", addNewUser);
APP.post<{ "Body": UpdateUserBody }>("/api/user/update_user", { preHandler: verifyAuth }, updateUserInfos);
APP.get("/api/user/get_user", { preHandler: verifyAuth }, getUserInfos);
APP.post("/api/user/login", connectUser);
APP.get("/api/user/logout", { preHandler: verifyAuth }, disconnectUser);
APP.post("/api/user/picture", getPicture);
APP.post("/api/user/change_picture", { preHandler: verifyAuth }, changePicture);
APP.post<{ Body:ThemeBody }>("/api/user/change_theme", { preHandler: verifyAuth }, changeTheme);

// --- 2FA ---
APP.post("/api/user/secure", verify2FA);
APP.get("/api/user/enable-secure", { preHandler: verifyAuth }, enable2FA);
APP.get("/api/user/disable-secure", { preHandler: verifyAuth }, disable2FA);

// --- Friends ---
APP.post("/api/friends/list", getFriendList);
APP.post<{ Body: UserBody }>("/api/friends/add", { preHandler: verifyAuth }, newFriend);
APP.post<{ Body: UserBody }>("/api/friends/remove", { preHandler: verifyAuth }, removeFriend);

// --- Games ---
APP.post<{ Body: GameOptions }>("/api/game/local_game", { preHandler: verifyAuth }, newLocalGame);
APP.post<{ Body: GameOptions }>("/api/game/ai_game", { preHandler: verifyAuth }, newAIGame);
APP.get("/api/game/ranked_game", { preHandler: verifyAuth }, addPlayerToMatchmakingSystem);
APP.get("/api/game/waiting", { preHandler: verifyAuth }, isGameFound);

/**
 * Register plugins like `fastifyCors` or `fastifyCookies` globally, Fastify applies those preHandlers and hooks immediately.
 * For WebSocket routes, this can break the upgrade request, because WS upgrade requests are special HTTP GETs:
 * (they must get a 101 Switching Protocols response).
 * By wrapping the WebSocket route in a register, we are creating a separate encapsulated context where Global hooks don’t interfere with the WebSocket upgrade.
 */
// --- Web Socket route handlers ---
APP.register(() => {
	APP.get('/ws/:id', { websocket: true }, newGame);
});

// --- Start server ---
async function start(): Promise<void> {
	try {
		console.log(`Backend running !`);
		await initDB(); // initialize DB before server
		await APP.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();
