//Student and Employer SignUp

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

describe("Testing Edit of Student profile", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("should update user profile", async () => {
    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const token = jwt.sign({ _id: "64327505a235061dabc8621a" }, secretKey);
    const response = await request(app)
      .patch("/api/userprofile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "Unit Test",
        email: "UnitTest@gmail.com",
        description: "Test",
      });

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
