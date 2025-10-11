import { FastifyRequest, FastifyReply } from "fastify";
import { findUserPassword } from "../database/find_data.js";

interface NewUserBody {
	id: string;
	pseudo: string;
	password: string;
	ppLink: string;
}

export async function connectUser(req: FastifyRequest<{ Body: NewUserBody }>, reply: FastifyReply): Promise<void> {
	const { id, password } = req.body;

	const realPassword: string = await findUserPassword(id);

	/** @todo hash the password */
	if (realPassword === password) {
		reply.code(201).send({ success: true, message: "Successfuly loged in" });
		/** @todo procede actual connection whith cookies ?? */
	} else {
		reply.code(201).send({ success: false, message: "Wrong id or password" });
	}
}