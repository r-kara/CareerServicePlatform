const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

describe("Import CV", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("uploads a file and updates the user's resume", async () => {
    const secretKey = process.env.JWT_SECRET || "default-secret-key";
    const token = jwt.sign({ _id: "64327505a235061dabc8621a" }, secretKey);

    const response = await request(app)
      .post("/api/resume")
      .set("Authorization", `Bearer ${token}`)
      .attach("resume", path.join(__dirname, "resume.pdf"));

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
