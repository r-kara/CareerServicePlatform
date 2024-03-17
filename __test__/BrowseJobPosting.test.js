const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("Testing Browsing for job postings", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("Search job-postings", async () => {
    const response = await request(app).get("/api/job-postings");

    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
