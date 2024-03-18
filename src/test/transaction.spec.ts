import { expect, test, describe, beforeAll, afterAll, beforeEach } from "vitest";

import { execSync } from "node:child_process";

import { app } from "../app";
import request from "supertest";

describe("Transaction Routes", () => {
  beforeAll(async () => {
    await app.ready();
  })
  
  afterAll(async () => {
    await app.close();
  })

  beforeEach(() => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");
  })
  
  test("It should be able to create a new transaction", async () => {
    const response = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });
  
    expect(response.statusCode).toEqual(201);
  });

  test("It should be able to list all transactions from one user", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });

      const cookies = createTransactionResponse.get("Set-Cookie");

      const listTransactionsResponse = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookies);

      expect(listTransactionsResponse.statusCode).toEqual(200);
      expect(listTransactionsResponse.body.transactions).toEqual([
        expect.objectContaining({
          title: "New Transaction",
          amount: 5000,
        })
      ])
  })

  test("It should be able to get a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);
    
    const transactionId = listTransactionsResponse.body.transactions[0].id;
    
    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "New Transaction",
        amount: 5000,
      })
    )
  })

  test("It should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Credit Transaction",
        amount: 5000,
        type: "credit",
      });

      const cookies = createTransactionResponse.get("Set-Cookie");

      await request(app.server)
        .post("/transactions")
        .send({
          title: "Debit Transaction",
          amount: 2000,
          type: "debit",
        })
        .set("Cookie", cookies)

      const summaryResponse = await request(app.server)
        .get("/transactions/summary")
        .set("Cookie", cookies);

      expect(summaryResponse.body.summary).toEqual({
        amount: 3000,
      })
  })
});