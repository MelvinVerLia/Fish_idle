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

setInterval(async () => {
  await updateWallets();
  // await updateIdle();
}, 5000);

async function updateWallets() {
  try {
    const inventoryCount = await db.query(`
        SELECT COUNT(*) AS count 
        FROM factory_inventory
      `);

    // If there are no records, don't proceed with the update
    if (inventoryCount.rows[0].count === 0) {
      console.log("No records in factory_inventory. Skipping wallet update.");
      return; // Exit the function early
    }

    await db.query(`
        UPDATE users 
        SET wallet = wallet + earnings
        FROM (
          SELECT user_id, SUM(production_rate * quantity) AS earnings
          FROM factory_inventory
          JOIN factory ON factory_inventory.factory_id = factory.id
          GROUP BY user_id
        ) AS earnings_table
        WHERE users.id = earnings_table.user_id;
      `);
    const updatedWallets = await db.query("SELECT id, wallet FROM users");

    console.log("Wallets updated successfully.");
  } catch (error) {
    console.error("Error updating wallets:", error);
  }
}

// async function updateIdle() {
//   console.log("hi");
//   try {
//     const inventoryCount = await db.query(`
//         SELECT COUNT(*) AS count
//         FROM factory_inventory
//       `);
//     // If there are no records, don't proceed with the update
//     if (inventoryCount.rows[0].count === 0) {
//       console.log("No records in factory_inventory. Skipping wallet update.");
//       return; // Exit the function early
//     }
//     const result = await db.query(`
//       SELECT fi.user_id, SUM(f.production_rate * fi.quantity / 5) AS total_production
//       FROM factory_inventory fi
//       JOIN factory f ON fi.factory_id = f.id
//       GROUP BY fi.user_id
//     `);

//     result.rows.forEach((row) => {
//       console.log(
//         `User ID: ${row.user_id}, Idle Production: ${row.total_production}`
//       );
//     });

//     res.json({ user_id, idleRate: total_production });
//     console.log({ user_id, idleRate: total_production });
//   } catch (error) {}
// }

app.get("/idle-total", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const response = await db.query(
      `
      SELECT SUM(f.production_rate * fi.quantity /5) AS total_production
      FROM factory_inventory fi
      JOIN factory f ON fi.factory_id = f.id
      WHERE fi.user_id = $1
    `,
      [userId]
    );

    console.log(response.rows[0].total_production);
    // const totalProduction = response.rows[0]?.total_production ?? 0;

    res.json(response.rows[0].total_production);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
