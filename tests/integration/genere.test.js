const request = require("supertest");
const { Genere } = require("../../models/genere");
const { User } = require("../../models/user");
const { exceptions } = require("winston");

let server;

describe("/api/genere", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genere.deleteMany({});
  });
  describe("Get/", () => {
    it("should return all the generes ", async () => {
      await Genere.collection.insertMany([
        { name: "genere1" },
        { name: "genere2" },
      ]);
      const response = await request(server).get("/api/generes");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some((g) => g.name === "genere1")).toBeTruthy();
      expect(response.body.some((g) => g.name === "genere2")).toBeTruthy();
    });
  });
  describe("Get/:id", () => {
    beforeEach(async () => {
      server = require("../../index");
    });
    afterEach(async () => {
      await server.close();
      await Genere.deleteMany({});
    });
    it("should return the genere with the given id ", async () => {
      const genere = new Genere({ name: "genere1" });
      await genere.save();
      const response = await request(server).get("/api/generes/" + genere._id);
      expect(response.statusCode).toBe(200);
      expect(response.body[0]).toHaveProperty("name", genere.name);
    });
    it("should throw an error if the Genere does not exists ", async () => {
      const response = await request(server).get("/api/generes/1");
      expect(response.statusCode).toBe(404);
    });
  });
  describe("Post /", () => {
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/generes")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genere1";
    });
    afterEach(async () => {
      await server.close();
    });

    it("should return 401 if the client is not logged in", async () => {
      token = "";

      const response = await exec();

      expect(response.status).toBe(401);
    });
    it("should return 400 if the genere is less than 5 characters", async () => {
      name = "1234";

      const response = await exec();

      expect(response.status).toBe(400);
    });
    it("should return 400 if the genere is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const response = await exec();

      expect(response.status).toBe(400);
    });
    it("should save the genere if it is valid", async () => {
      await exec();

      const genere = await Genere.find({ name: "genere1" });

      expect(genere).not.toBe(null);
    });
    it("should return the genere if it is valid", async () => {
      const response = await exec();

      expect(response.body._id).not.toBe(null);

      expect(response.body.name).toBe("genere1");
    });
  });
});
