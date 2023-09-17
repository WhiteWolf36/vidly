const request = require("supertest");
const { User } = require("../../models/user");
const { Genere } = require("../../models/genere");

describe("auth middleware", () => {
  let server;
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genere.deleteMany({});
  });
  let token;
  const exec = () => {
    return request(server)
      .post("/api/generes")
      .set("x-auth-token", token)
      .send({ name: "genere1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
  });
  it("should return 401 if no token is provided ", async () => {
    token = "";
    const response = await exec();
    expect(response.status).toBe(401);
  });

  it("should return 400 if invalid token is provided ", async () => {
    token = "dsd";
    const response = await exec();
    expect(response.status).toBe(400);
  });

  it("should return 200 if valid token is provided ", async () => {
    const response = await exec();
    expect(response.status).toBe(200);
  });
  afterEach(async () => {
    await server.close();
    await Genere.deleteMany({});
  });
});
