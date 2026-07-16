import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env.js";
async function authPlugin(fastify) {
  fastify.decorate("authenticate", async (request, reply) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return reply.status(401).send({ message: "Token de autentica\xE7\xE3o n\xE3o fornecido." });
    }
    try {
      const decoded = jwt.verify(token, getEnv().JWT_SECRET);
      request.user = decoded;
    } catch (err) {
      return reply.status(403).send({ message: "Sess\xE3o expirada ou token inv\xE1lido." });
    }
  });
}
var stdin_default = fp(authPlugin, {
  name: "auth"
});
export {
  stdin_default as default
};
