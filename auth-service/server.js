require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const PORT = process.env.PORT;
const bcrypt = require("bcrypt");
const jwtGenerator = require("./utils/jwtGenerator");
const validInfo = require("./middleware/validInfo");
const authorization = require("./middleware/authorization");

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/register", validInfo, async (req, res) => {
  const { name, email, password } = req.body;

  console.log("hi");
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rowCount != 0) {
      return res.status(401).json("User already exists");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPass = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPass]
    );

    const token = jwtGenerator(newUser.rows[0].id);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

app.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await db.query(
      "SELECT id, name, password FROM users WHERE email = $1",
      [email]
    );

    console.log(checkUser.rows);

    if (checkUser.rowCount === 0) {
      return res.status(401).json("Password or email is incorrect");
    }

    const validPassword = await bcrypt.compare(
      password,
      checkUser.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect");
    }

    const token = jwtGenerator(checkUser.rows[0].id);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

//verify if the token is valid
app.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

app.get("/dashboard", authorization, async (req, res) => {
  //req.user has the payload
  try {
    // res.json(req.user);
    const user = await db.query("SELECT id, name FROM users WHERE id = $1", [
      req.user,
    ]);

    res.json(user.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});
