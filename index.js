const express = require("express");
const app = express();
require("dotenv").config();

const connection = require("mysql").createConnection({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.clear();
    console.log(`\x1b[31m>>\x1b[0m MySQL Connection Failed.`);
  }
});

app.get("/api/auth/:product", (req, res) => {
  const ip = req.ip;
  const product = req.params.product;

  try {
    connection.query(
      "SELECT * FROM licenses WHERE product = ? AND ip = ?",
      [product, ip],
      (err, rows) => {
        if (err) {
          console.clear();
          console.log(`\x1b[31m>>\x1b[0m MySQL Connection Failed.`);
          res.send({ authorized: false });
        }

        if (rows.length === 0) {
          res.send({ authorized: false });
          console.log(
            `\x1b[31m>>\x1b[0m Request Failed ( IP: ${ip} / Product: ${product} )`
          );
        } else if (rows.length === 1) {
          res.send({ authorized: true });
          console.log(
            `\x1b[32m>>\x1b[0m Request Success ( IP: ${ip} / Product: ${product} )`
          );
        }
      }
    );
  } catch (err) {
    res.send({ authorized: false });
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(
    `\x1b[32m>>\x1b[0m Authentication Listen on Port ${process.env.PORT}`
  );
  console.log(
    `\x1b[31m>>\x1b[0m \x1b[4mYou have Questions or Problems Dm Author\x1b[0m ( https://arda-dev.xyz ).`
  );
});
