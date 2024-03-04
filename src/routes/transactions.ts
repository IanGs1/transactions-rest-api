import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import crypto from "node:crypto";

import knex from "../database/knex";

export async function transactionRoutes(app: FastifyInstance) {
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    })
    
    const { title, amount, type } = createTransactionBodySchema.parse(request.body);

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return reply.status(201).send();
  });

  app.get("/", async () => {
    const transactions = await knex("transactions").select();

    return {
      transactions,
    };
  })

  app.get("/summary", async () => {
    const summary = await knex("transactions").sum("amount", { as: "amount" }).first();
    
    return {
      summary,
    }
  })

  app.get("/:transactionId", async (request: FastifyRequest, reply: FastifyReply) => {
    const getTransactionParamsSchema = z.object({
      transactionId: z.string().uuid(),
    });

    const { transactionId } = getTransactionParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where({ id: transactionId }).first();
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