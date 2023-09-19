const request = require("supertest");
const { Genere } = require("../../models/genere");
const { User } = require("../../models/user");
const { exceptions } = require("winston");
const { default: mongoose } = require("mongoose");

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
      expect(response.body).toHaveProperty("name", genere.name);
    });
    it("should throw 404 if the Genere does not exists ", async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await request(server).get("/api/generes/" + id);
      expect(response.statusCode).toBe(404);
    });
    it("should throw 404 if we pass invalid id ", async () => {
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

  describe("Put / ", () => {
    let token;
    let objectId;
    let existingGenere;
    beforeEach(async () => {
      const user = new User({ isAdmin: true });
      token = user.generateAuthToken();
      existingGenere = new Genere({
        _id: new mongoose.Types.ObjectId(),
        name: "genere1",
      });
      await existingGenere.save();
    });
    afterEach(async () => {
      // Clean up the database
      await Genere.deleteMany({});
    });
    const exec = async (id, name) => {
      return request(server)
        .put(`/api/generes/${id}`)
        .set("x-auth-token", token)
        .send({ name });
    };
    it("should return 400 if genere is less than 5 characters ", async () => {
      console.log(existingGenere);
      const response = await exec(existingGenere._id, { name: "123" });
      expect(response.status).toBe(400);
    });
    it("should return 400 if genere is more than 50 characters ", async () => {
      const response = await exec(existingGenere._id, {
        name: new Array(52).join("a"),
      });
      expect(response.status).toBe(400);
    });
    it("should return 401 if the client is not logged in", async () => {
      token = "";

      const response = await exec(existingGenere._id, "genere1");

      expect(response.status).toBe(401);
    });
    it("should return 404 if invalid id is passed ", async () => {
      const response = await exec(new mongoose.Types.ObjectId(), "genere1");
      expect(response.status).toBe(404);
    });
    it("should return 200 if valid genere is updated ", async () => {
      const response = await exec(existingGenere._id, "genere2");
      expect(response.status).toBe(200);
    });
  });
  describe("Delete /", () => {
    let token;
    let objectId = "";
    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
    });
    const exec = () => {
      return request(server)
        .delete(`/api/generes/${objectId}`)
        .set("x-auth-token", token);
    };
    it("should return 404 error if we supply an invalid object id parameter", async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return 404 error if we supply a valid objectId that does not belong to any existing genre", async () => {
      objectId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return the deleted genre if the delete was successful", async () => {
      objectId = new mongoose.Types.ObjectId();
      const schema = {
        _id: objectId.toHexString(),
        name: "genre1",
      };
      const genere = await new Genere(schema).save();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(schema);
    });
  });
});
