//Student and Employer SignUp

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const MailingList = require("../models/mailing-lists");

describe("Testing mailing list", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("Retrieve all subscribers from mailing list", async () => {
    const response = await request(app).get("/api/mailing-lists");
    expect(response.statusCode).toBe(200);
  });

  it("Adding subscriber to mailing list", async () => {
    const response = await request(app).post("/api/mailing-lists").send({
      email: "Testing@gmail.com",
    });

    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await MailingList.findOneAndDelete({
      email: "Testing@gmail.com",
    }).exec();
    await mongoose.connection.close();
  });
});
