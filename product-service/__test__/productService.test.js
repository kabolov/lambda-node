const handler = require("../handler");
import { expect } from "@jest/globals";
import products from "../src/products.json";

test("Correctly receveing all products", async () => {
  expect(await handler.getAllProducts()).toStrictEqual({
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    statusCode: 200,
    body: JSON.stringify(products),
  });
});

test("Correctly receveing 1 product", async () => {
  expect(
    await handler.getProductById({
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
    })
  ).toStrictEqual({
    body: JSON.stringify([
      {
        count: 4,
        description:
          "The newest wireless Happy Hacking keyboard makes a few smart changes and a strong case for minimalist ҤesignerӠkeyboards.",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 90,
        title: "Womier k87",
      },
    ]),
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    statusCode: 200,
  });
});

test("Should handle 404 error", async () => {
  expect(
    await handler.getProductById({
      pathParameters: { productId: "bla-bla-bla" },
    })
  ).toStrictEqual({
    statusCode: 404,
    body: "no product found with this id",
  });
});
