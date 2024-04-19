// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByNameJob = (name, job) =>
  users["users_list"].find((user) => user["name"] === name && user["job"] === job);

const getId = (id) => {
  let index = users["users_list"].indexOf(findUserById(id));
  return index;
}

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users/:name/:job", (req, res) => {
  const name = req.params["name"];
  const job = req.params["job"];
  
  let result = findUserByNameJob(name, job);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

function genID(){
  return Math.random();
}

const addUser = (user) => {
  user.id = genID();
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).send(res.body);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let index = getId(id)
  users["users_list"].splice(index, 1);
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});