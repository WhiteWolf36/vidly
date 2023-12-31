const { default: mongoose } = require("mongoose");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const request = require("supertest");

const moment = require("moment");
const { Movie } = require("../../models/movie");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;
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

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genere: {
        name: "12345",
      },
      numberInStock: 10,
    });
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
    await movie.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it("should return 401 if the user is not logged in", async () => {
    token = "";
    const response = await exec();
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
  it("should return 404 if no rental for customer/movie", async () => {
    await Rental.deleteMany({});
    const response = await exec();
    expect(response.status).toBe(404);
  });
  it("should return 400 if the rental is already proccessed", async () => {
    rental.dateReturned = Date.now();
    await rental.save();
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 200 if we get a valid request", async () => {
    const response = await exec();
    expect(response.status).toBe(200);
  });
  it("should set the return date if we get a valid request", async () => {
    const response = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });
  it("should return the rental fee if we get a valid request", async () => {
    rental.dateOut = moment().add(-7, "days");
    await rental.save();
    const response = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  it("should increase the stock of the movie ", async () => {
    const response = await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
  it("should return the rental in the body of the request", async () => {
    const response = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(response.body).toHaveProperty("dateOut");
    expect(response.body).toHaveProperty("dateReturned");
    expect(response.body).toHaveProperty("rentalFee");
    expect(response.body).toHaveProperty("customer");
    expect(response.body).toHaveProperty("movie");
  });
});
