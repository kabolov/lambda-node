const { Client } = require("pg");

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // to avoid warring in this example
  },
  connectionTimeoutMillis: 5000, // time in millisecond for termination of the database query
};

const catalogBatchProcess = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    event.Records.forEach(async ({ body }) => {
      console.log(body);
      const { title, description, price, count } = JSON.parse(body);

      const {
        rows,
      } = await client.query(
        `insert into products (title, description, price) values ($1, $2, $3) returning id`,
        [title, description, price]
      );

      const newId = rows[0].id;

      await client.query(
        `insert into stocks (product_id, count) values ($1, $2)`,
        [newId, count]
      );

      await client.query(
        `select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on s.product_id = p.id where p.id = $1`,
        [newId]
      );
    });

    return {
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: 200,
      body: JSON.stringify({ status: "success" }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: "Intenal Server Error",
    };
  }
};

module.exports = {
  catalogBatchProcess,
};
