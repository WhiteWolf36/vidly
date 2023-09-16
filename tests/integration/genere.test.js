const request = require("supertest");
const { Genere } = require("../../models/genere");
const { response } = require("express");
let server;

describe("/api/genere", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
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
      server.close();
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
});
