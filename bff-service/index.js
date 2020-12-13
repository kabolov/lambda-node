const express = require("express");
const axios = require("axios").default;

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.all("/products", async (req, res) => {
  try {
    console.log("request start");
    const service = req.originalUrl.split("/")[1];
    console.log("service", service);
    const serviceUrl = process.env[service];
    console.log("serviceUrl", serviceUrl);

    if (serviceUrl) {
      const method = req.method;
      console.log("Method: ", method);
      const body = req.body;
      console.log("body", body);
      const axiosConfig = {
        method,
        url: `${serviceUrl}${req.originalUrl}`,
        ...(body && Object.keys(body).length > 0 && { data: body }),
      };

      console.log("axiosConfig", axiosConfig);

      const result = await axios(axiosConfig);
      console.log("axiosCallResult", JSON.stringify(result.data));
      res.json(result.data);
    } else {
      throw new Error("No service URL");
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      const { status, data } = error.response;

      res.status(status).json(data);
    } else if (error.message === "No service URL") {
      res.status(502).send("Cannot process request");
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.all("/*", async (req, res) => {
  try {
    console.log("request start");
    const service = req.originalUrl.split("/")[1];
    console.log("service", service);
    const serviceUrl = process.env[service];
    console.log("serviceUrl", serviceUrl);
    console.log("Original url", req.originalUrl.split("/"));

    if (serviceUrl) {
      const method = req.method;
      console.log("Method: ", method);
      const body = req.body;
      console.log("body", body);

      const path = req.originalUrl.split("/");
      if (service === "cart") {
        path.splice(1, 1);
      }

      const axiosConfig = {
        method,
        url: `${serviceUrl}${path.join("/")}`,
        ...(body && Object.keys(body).length > 0 && { data: body }),
      };

      console.log("axiosConfig", axiosConfig);

      const result = await axios(axiosConfig);
      console.log("axiosCallResult", JSON.stringify(result.data));
      res.json(result.data);
    } else {
      throw new Error("No service URL");
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      const { status, data } = error.response;

      res.status(status).json(data);
    } else if (error.message === "No service URL") {
      res.status(502).send("Cannot process request");
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log("Up and running");
});
