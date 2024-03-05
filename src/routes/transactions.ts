import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import crypto from "node:crypto";

import knex from "../database/knex";

import { checkSessionIdExists } from "../middlewares/checkSessionIdExists";

export async function transactionRoutes(app: FastifyInstance) {
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    })
    
    const { title, amount, type } = createTransactionBodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });

  app.get("/", { preHandler: [checkSessionIdExists] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { sessionId } = request.cookies;

    const transactions = await knex("transactions").where({ session_id: sessionId }).select();

    return {
      transactions,
    };
  })

  app.get("/summary", { preHandler: [checkSessionIdExists] }, async (request: FastifyRequest) => {
    const { sessionId } = request.cookies;

    const summary = await knex("transactions").where({ session_id: sessionId }).sum("amount", { as: "amount" }).first();
    
    return {
      summary,
    }
  })

  app.get("/:transactionId", { preHandler: [checkSessionIdExists] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const getTransactionParamsSchema = z.object({
      transactionId: z.string().uuid(),
    });

    const { transactionId } = getTransactionParamsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const transaction = await knex("transactions").where({ id: transactionId, session_id: sessionId }).first();
    if (!transaction) {
      return reply.status(404).send({
        status: "Error",
        message: "It wasn't able to find your transaction!",
      });
    }

    return {
      transaction,
    }
  })
}