const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const jobPosting = require("../models/job-postings");

describe("CRUD manipulation on job postings", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("GET /all-job-postings", async () => {
    const response = await request(app).get("/api/job-postings");
    expect(response.statusCode).toBe(200);
  });

  it("POST /job-postings", async () => {
    const response = await request(app).post("/api/job-postings").send({
      title: "Test",
      description: "Test",
      company: "Testing",
    });
    expect(response.statusCode).toBe(200);
  });

  it("DELETE /job-postings", async () => {
    const response = await request(app).delete("/api/job-postings/12345");
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await jobPosting
      .findOneAndDelete({
        company: "Testing",
      })
      .exec();
    await mongoose.connection.close();
  });
});
