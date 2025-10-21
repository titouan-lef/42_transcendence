import { FastifyRequest, FastifyReply } from "fastify";
import { insertUser } from "../database/insert_data.js";

interface NewUserBody {
	id: string;
	pseudo: string;
	password: string;
	ppLink: string;
}

async function addNewUser(req: FastifyRequest<{ "Body": NewUserBody }>, reply: FastifyReply): Promise<void> {
	try {
		const { id, pseudo, password, ppLink } = req.body;

		/** @todo hash the password */
		await insertUser(id, pseudo, password, ppLink);
		reply.code(201).send({ success: true, message: "User created" });

	} catch (err: unknown) {
		if ( typeof err === "object" && err !== null && "code" in err && err.code === "SQLITE_CONSTRAINT") {
			reply.code(201).send({ success: false, message: "ID already taken" });
		} else {
			reply.code(500).send({ success: false, message: "Internal server error" });
		}
	}
}

export { addNewUser };