import products from "./products.json";

export const getAllProducts = async (event) => {
  try {
    console.log("Lambda invocation with event: ", event);

    return {
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
};
