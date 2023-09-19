const { default: mongoose } = require("mongoose");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const request = require("supertest");
const { response } = require("express");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
  });

  it("should return 401 if the user is not logged in", async () => {
    token = "";
    const response = await request(server)
      .post("/api/returns")
      .send({ customerId, movieId });
    expect(response.status).toBe(401);
  });
  it("should return 400 if no customer id is provided", async () => {
    customerId = "";
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 400 if no movie id is provided", async () => {
    movieId = "";

    const response = await exec();
    expect(response.status).toBe(400);
  });
});
