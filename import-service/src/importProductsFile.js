const AWS = require("aws-sdk");

const importProductsFile = async (event) => {
  const { name } = event.queryStringParameters;

  console.log("name", name);

  const s3 = new AWS.S3({ region: "eu-west-1" });
  const params = {
    Bucket: "import-product-service",
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await new Promise((resolve, reject) => {
      s3.getSignedUrl("putObject", params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });

    return {
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      statusCode: 200,
      body: JSON.stringify(signedUrl),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};

module.exports = { importProductsFile };
