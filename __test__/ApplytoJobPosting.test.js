const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

describe("Testing applying to jobPosting", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("POST /application", async () => {
    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const token = jwt.sign({ _id: "64327505a235061dabc8621a" }, secretKey);
    const response = await request(app)
      .get("/api/notification")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
