const aws = require("aws-sdk");

const region = "us-west-2";
const bucketName = "contendr-bucket";
const accessKeyId = "";
const secretAccessKey = "";

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "4",
});

[
  {
    AllowedHeaders: ["*"],
    AllowedMethods: ["PUT", "HEAD", "GET"],
    AllowedOrigins: ["*"],
    ExposeHeaders: [],
  },
];
