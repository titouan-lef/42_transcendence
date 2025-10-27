import { FastifyRequest, FastifyReply } from "fastify";
import { insertUser } from "../database/insert_data.js";
import { hashString } from "../utils/hashString.js";

interface NewUserBody {
	id: string;
	pseudo: string;
	password: string;
	ppLink: string;
}

function isSQLConstraintError(err: unknown) : boolean {
	return (typeof err === "object" && err !== null && "code" in err && err.code === "SQLITE_CONSTRAINT");
}

async function addNewUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	try {
		const { id, pseudo, password, ppLink } = req.body;

		await insertUser(id, pseudo, hashString(password), ppLink);
		reply.code(201).send({ success: true, message: "User created" });

	} catch (err: unknown) {
		if (isSQLConstraintError(err)) {
			reply.code(201).send({ success: false, message: "ID already taken" });
		} else {
			reply.code(500).send({ success: false, message: "Internal server error" });
		}
	}
}

export { addNewUser };
