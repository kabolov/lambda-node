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

export const getProductById = async (event) => {
  try {
    console.log("Lambda invocation with event: ", event);

    const { productId } = event.pathParameters;

    const client = new Client(dbOptions);
    await client.connect();

    const {
      rows: product,
    } = await client.query(
      `select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on s.product_id = p.id where p.id = $1`,
      [productId]
    );

    return {
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
};
