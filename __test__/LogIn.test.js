//Student and Employer Login

const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Testing LogIn', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true });
  });

  it('User Login should respond with 200 status code', async () => {
    const response = await request(app)
      .post('/api/user-login')
      .send({
        email : "UnitTest@gmail.com",
        password : "Test1234"
      });
    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });

  it('Employer Login should respond with 200 status code', async () => {
    const response = await request(app)
      .post('/api/employer-login')
      .send({
        email : "UnitTest@gmail.com",
        password : "Test1234"
      });
    expect(response.statusCode).toBe(200);
  });



  afterAll(async () => {
    await mongoose.connection.close();
  });
});

