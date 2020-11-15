const AWS = require("aws-sdk");
const csv = require("csv-parser");

const BUCKET_NAME = "import-product-service";

const importFileParser = async (event) => {
  const { key } = event.Records[0]["s3"]["object"];
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  try {
    const s3Stream = s3.getObject(params).createReadStream();

    console.log(`${BUCKET_NAME}/${key}`);
    console.log(key.replace("uploaded", "parsed"));

    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          console.log(data);
        })
        .on("error", (e) => {
          console.log(e);
        })
        .on("end", async () => {
          console.log("ended");

          await s3
            .copyObject({
              Bucket: BUCKET_NAME,
              CopySource: `${BUCKET_NAME}/${key}`,
              Key: key.replace("uploaded", "parsed"),
            })
            .promise();

          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: key,
            })
            .promise();
        });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: "true" }),
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { importFileParser };
