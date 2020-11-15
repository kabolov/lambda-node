const AWS = require("aws-sdk");

const importFileParser = async (event) => {
  const { key } = event.Records[0]["s3"]["object"];
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const params = {
    Bucket: "import-product-service",
    Key: key,
  };
  try {
    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream.on("data", (chunk) => {
      console.log(chunk);
    });
  } catch (error) {}
};

module.exports = { importFileParser };
