import fastify from "fastify";

import crypto from "node:crypto"

import knex from "./database/knex";

const app = fastify();

app.post("/transactions", async (request, reply) => {
  const transactions = await knex("transactions").insert({
    id: crypto.randomUUID(),
    title: "Transação de teste",
    amount: 1000,
  }).returning("*");

  return transactions;
})

app
  .listen({ port: 3333 })
  .then(() => {
    console.log("HTTP server listening on: localhost:3333 ✨");
  })