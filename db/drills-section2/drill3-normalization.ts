import { pool, setupTables } from "./db.js";

async function main() {
  await setupTables();

  await pool.query(`
    CREATE TABLE orders_denormalized (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL
    )
  `);

  const orders = [
    ["Girish", "girish@example.com", "Laptop", 999.99],
    ["Girish", "girish@example.com", "Mouse", 29.99],
    ["Girish", "girish@example.com", "Keyboard", 79.99],
    ["Revanth", "revanth@example.com", "Monitor", 499.99],
    ["Revanth", "revanth@example.com", "Headphones", 149.99],
  ];

  for (const [name, email, product, price] of orders) {
    await pool.query(
      "INSERT INTO orders_denormalized (customer_name, customer_email, product_name, price) VALUES ($1, $2, $3, $4)",
      [name, email, product, price],
    );
  }

  console.log("DENORMALIZED (bad — data repeated):");
  console.table((await pool.query("SELECT * FROM orders_denormalized")).rows);

  await pool.query(
    "UPDATE orders_denormalized SET customer_email = $1 WHERE customer_name = $2",
    ["girish.new@example.com", "Girish"],
  );
  console.log("Updated Girish's email → had to update 3 rows\n");

  await pool.query(`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE orders_normalized (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      product_name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL
    )
  `);

  const g = await pool.query(
    "INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *",
    ["Girish", "girish@example.com"],
  );
  const r = await pool.query(
    "INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *",
    ["Revanth", "revanth@example.com"],
  );

  for (const [, , product, price] of orders.slice(0, 3)) {
    await pool.query(
      "INSERT INTO orders_normalized (customer_id, product_name, price) VALUES ($1, $2, $3)",
      [g.rows[0].id, product, price],
    );
  }
  for (const [, , product, price] of orders.slice(3)) {
    await pool.query(
      "INSERT INTO orders_normalized (customer_id, product_name, price) VALUES ($1, $2, $3)",
      [r.rows[0].id, product, price],
    );
  }

  console.log("NORMALIZED (good — data stored once):");
  console.log("Customers:");
  console.table((await pool.query("SELECT * FROM customers")).rows);
  console.log("Orders:");
  console.table((await pool.query("SELECT * FROM orders_normalized")).rows);

  await pool.query("UPDATE customers SET email = $1 WHERE id = $2", [
    "girish.new@example.com",
    g.rows[0].id,
  ]);
  console.log("Updated Girish's email → only 1 row changed\n");

  const joined = await pool.query(`
    SELECT o.id, c.name, c.email, o.product_name, o.price
    FROM orders_normalized o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.id
  `);
  console.log("JOIN gives the same result, but data is clean:");
  console.table(joined.rows);

  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
