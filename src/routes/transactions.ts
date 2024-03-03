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
  })
}