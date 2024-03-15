import { expect, test, describe, beforeAll, afterAll } from "vitest";

import { app } from "../app";
import request from "supertest";

describe("Transaction Routes", () => {
  beforeAll(async () => {
    await app.ready();
  })
  
  afterAll(async () => {
    await app.close();
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
});