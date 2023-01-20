const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const users = [];
class User {
  constructor(id) {
    this.id = id;
  }
  assignNation(nation) {
    this.nation = nation;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  assignAttack(attacks) {
    this.attacks = attacks;
  }
}
class Nation {
  constructor(name) {
    this.name = name;
  }
}

app.get("/join", (req, res) => {
  const id = `${Math.random()}`;
  const user = new User(id);
  users.push(user);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

app.post("/nation/:userId", (req, res) => {
  const userId = req.params.userId || "";
  const nameSelection = req.body.nation || "";
  const nation = new Nation(nameSelection);
  const userIndex = users.findIndex((user) => userId === user.id);

  if (userIndex >= 0) {
    users[userIndex].assignNation(nation);
  }
  res.end();
});

app.post("/nation/:userId/position", (req, res) => {
  const userId = req.params.userId || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;
  const userIndex = users.findIndex((user) => userId === user.id);

  if (userIndex >= 0) {
    users[userIndex].setPosition(x, y);
  }

  const enemies = users.filter((user) => userId !== user.id);
  res.send({
    enemies,
  });
});

app.post("/nation/:userId/attacks", (req, res) => {
  const userId = req.params.userId || "";
  const userAttacks = req.body.attacks || [];
  const userIndex = users.findIndex((user) => userId === user.id);
  console.log(userId);
  console.log(userAttacks);
  if (userIndex >= 0) {
    users[userIndex].assignAttack(userAttacks);
  }
  res.end();
});

app.get("/nation/:userId/attacks", (req, res) => {
  const userId = req.params.userId || "";
  const user = users.find((user) => user.id === userId);
  res.send({
    attacks: user.attacks || [],
  });
});

app.listen(8080, () => {
  console.log("Servidor funcionando");
});
