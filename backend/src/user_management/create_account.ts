import { FastifyRequest, FastifyReply } from "fastify";
import { hashString } from "../utils/hash_string.js";
import { sendReply } from "../utils/HTTP.js";
import { insertUser } from "../database/user.js";

interface NewUserBody {
	id: string;
	pseudo: string;
	password: string;
}

function isSQLConstraintError(err: unknown) : boolean {
	return (typeof err === "object" && err !== null && "code" in err && err.code === "SQLITE_CONSTRAINT");
}

async function addNewUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	try {
		const { id, pseudo, password } = req.body;

		await insertUser(id, pseudo, hashString(password));
		sendReply(reply, 201, true, "User created");
	} catch (err: unknown) {
		if (isSQLConstraintError(err))
			sendReply(reply, 400, false, "ID already taken");
		else
			sendReply(reply, 500, false, "Internal server error");
	}
}

export { addNewUser };
