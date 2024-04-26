// backend.js
import express from "express";
import cors from "cors";
import userService from "./user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error ocurred in the server.");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  userService.findUserById(id).then((result) => {
    if (result === undefined || result === null)
      res.status(404).send("Resource not found.");
    else res.send({ users_list: result });
  })
  .catch((error) => {   // fixes CastError for improper syntax for ObjectId.
    res.status(404).send("Resource not found.");
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  userService.addUser(user).then((savedUser) => {
    if (savedUser) res.status(201).send(savedUser);
    else res.status(500).end();
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  console.log(id);
  userService.deleteById(id)
  .then((result) => {
    res.status(204).end();
  })
  .catch((error) => {
    res.status(404).send("Resource not found");
  });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});