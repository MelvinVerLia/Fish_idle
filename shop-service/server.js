require("dotenv").config();

const cors = require("cors");
const express = require("express");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json()); // Enables parsing of JSON request bodies

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//get all of the available factory
app.get("/shop/factory", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM factory");
    res.status(200).json({
      status: "success",
      factory: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//buy a factory
app.get("/shop/factory/buy/:id", async (req, res) => {
  try {
    const userId = req.query.userId;
    const { id: factoryId } = req.params;

    // Step 1: Get the factory price
    const factory = await db.query("SELECT price FROM factory WHERE id = $1", [
      factoryId,
    ]);
    if (factory.rows.length === 0) {
      return res.status(404).json({ error: "Factory not found" });
    }
    const factoryPrice = factory.rows[0].price;

    // Step 2: Get user wallet balance
    const user = await db.query("SELECT wallet FROM users WHERE id = $1", [
      userId,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userWallet = user.rows[0].wallet;

    // Step 3: Check if the user can afford the factory
    if (userWallet < factoryPrice) {
      return res.status(400).json({ error: "Not enough wallet balance" });
    }

    // Step 4: Deduct price from wallet
    await db.query("UPDATE users SET wallet = wallet - $1 WHERE id = $2", [
      factoryPrice,
      userId,
    ]);

    // Step 5: Insert or update factory inventory
    const result = await db.query(
      `
        INSERT INTO factory_inventory (user_id, factory_id, quantity)
        VALUES ($1, $2, 1)
        ON CONFLICT (user_id, factory_id)
        DO UPDATE SET quantity = factory_inventory.quantity + 1
        RETURNING *;
        `,
      [userId, factoryId]
    );

    const wallet = await db.query("SELECT wallet from users where id = $1", [
      userId,
    ]);

    res.status(200).json({
      status: "success",
      data: result.rows[0],
      wallet: wallet.rows[0],
      message: `Factory purchased successfully! Wallet deducted by ${factoryPrice}.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

const tiers = [
  { name: "Tier I", cost: 500, isPurchased: true },
  { name: "Tier II", cost: 1000, isPurchased: false },
  { name: "Tier III", cost: 5000, isPurchased: false },
  { name: "Tier IV", cost: 10000, isPurchased: false },
  { name: "Tier V", cost: 25000, isPurchased: false },
  { name: "Tier Max", cost: 100000, isPurchased: false },
];

app.put("/buy-tiers", async (req, res) => {
  const userId = req.body.userId;
  try {
    if (!userId) return res.json({ error: "User Id is required" });

    const response = await db.query(
      "SELECT wallet, level FROM users WHERE id = $1",
      [userId]
    );

    const { wallet, level } = response.rows[0];

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (level >= tiers.length) {
      return res.status(400).json({ error: "Max tier reached" });
    }

    const nextTier = tiers[level];
    if (wallet < nextTier.cost) {
      return res.status(400).json({ error: "Not enough money" });
    }

    tiers[level].isPurchased = true;
    const updateUser = await db.query(
      "UPDATE users SET wallet = wallet - $1, level = level + 1 WHERE id = $2 RETURNING wallet, level",
      [nextTier.cost, userId]
    );

    res.json({
      status: "success",
      message: `Upgraded to ${nextTier.name}`,
      wallet: updateUser.rows[0].wallet,
      level: updateUser.rows[0].level,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

app.get("/tiers", async (req, res) => {
  const userId = req.query.userId;
  try {
    const response = await db.query("SELECT level FROM users where id = $1", [
      userId,
    ]);
    const currLev = response.rows[0].level;
    res.status(200).json({
      status: "success",
      tiers: tiers,
      currentLevel: { currLev },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
