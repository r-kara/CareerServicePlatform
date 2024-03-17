//Student and Employer SignUp

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const userProfile = require("../models/UserProfile");
const employerProfile = require("../models/EmployerProfile");

describe("Testing SignUp", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it("User Signup should respond with 200 status code", async () => {
    const response = await request(app).post("/api/user-signup").send({
      username: "Test",
      email: "TestingSignUpUser@gmail.com",
      password: "Test1234",
    });
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  it("Employer Signup should respond with 200 status code", async () => {
    const response = await request(app).post("/api/employer-signup").send({
      cname: "TestingSignUp",
      email: "TestingSignUpEmployer@gmail.com",
      password: "Test1234",
    });

    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await employerProfile
      .findOneAndDelete({
        email: "TestingSignUpEmployer@gmail.com",
      })
      .exec();
    await userProfile
      .findOneAndDelete({
        email: "TestingSignUpUser@gmail.com",
      })
      .exec();
    await mongoose.connection.close();
  });
});
