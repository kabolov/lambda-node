const AWS = require("aws-sdk");
const csv = require("csv-parser");

const BUCKET_NAME = "import-product-service";

const importFileParser = async (event) => {
  const { key } = event.Records[0]["s3"]["object"];
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const sqs = new AWS.SQS();
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  try {
    const s3Stream = s3.getObject(params).createReadStream();

    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          console.log(data);
          sqs.sendMessage(
            {
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(data),
            },
            (error, data) => {
              if (error) console.log("!!!!!!!!!!!!!!!", error);
              console.log(data);
            }
          );
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
