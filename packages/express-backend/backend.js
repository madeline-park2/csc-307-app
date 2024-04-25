// backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

/* const users = {
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
}; */

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    job: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

function findUserByName(name) {
  return User.find({ name: name });
}

function findUserByJob(job) {
  return User.find({ job: job });
}
function findUserByNameJob(name, job) {
  return User.find({ name: name, job: job });
}

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = User.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  } else if (name && job) {
    promise = findUserByNameJob(name, job);
  }
  return promise;
}

function findUserById(id) {
  return User.findById(id);
}

function addUser(user) {
  const userToAdd = new User(user);
  const promise = userToAdd.save();
  return promise;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  getUsers(name, job)
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
  findUserById(id).then((result) => {
    if (result === undefined || result === null)
      res.status(404).send("Resource not found.");
    else res.send({ users_list: result });
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  addUser(user).then((savedUser) => {
    if (savedUser) res.status(201).send(savedUser);
    else res.status(500).end();
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  console.log(id);
  //let index = getId(id);
  User.findByIdAndDelete(id);
  //User.deleteOne({_id: id});
  res.end();
  /*if (index === -1) {
    res.status(404).send("Resource not found");
  }
  else {
    users["users_list"].splice(index, 1);
    res.status(204).end();
  } */
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});