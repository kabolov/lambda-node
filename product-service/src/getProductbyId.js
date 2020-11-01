import products from "./products.json";

export const getProductById = async (event) => {
  try {
    console.log("Lambda invocation with event: ", event);
    const { productId } = event.pathParameters;

    const product = products.filter((product) => product.id == productId);

    if (product.length === 0) {
      return {
        statusCode: 404,
        body: "no product found with this id",
      };
    }

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
