//////////////////////////////////////////////////////////////////////////////////////////
// THIRD PARTY MODULES
//////////////////////////////////////////////////////////////////////////////////////////
require("dotenv").config();

const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const colors = require("colors");

const Draw = require("./models/drawModel");

// Initialize app with express
const app = express();
app.use(cors());

//////////////////////////////////////////////////////////////////////////////////////////
// MONGODB CONFIGURATIONS
//////////////////////////////////////////////////////////////////////////////////////////

// Define Connect to DB
const connectDB = () => {
  // Connect to Mongo
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let mongoDB = mongoose.connection;
  mongoDB.on("error", () => {
    console.error.bind(console, "DB Connection Error: ");
  });
  mongoDB.once("open", () => {
    console.log("Connected to MongoDB...".cyan.underline);

    // TODO: figure out a way to make getData() callback function
    // GETTING DATA
    getData();
  });
};

//////////////////////////////////////////////////////////////////////////////////////////
// DEFINING WEBSCRAPER FUNCTION
//////////////////////////////////////////////////////////////////////////////////////////
const getData = () => {
  const url =
    "https://www.canadavisa.com/express-entry-invitations-to-apply-issued.html";

  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      let data = [];

      $("table", html).each(function () {
        const tr = $(this)
          .find("tr")
          .each(function () {
            const drawNo = $(this).find("td").eq(0).text();
            const minimumCRS = $(this).find("td").eq(1).text();
            const dateOfDraw = $(this).find("td").eq(2).text();
            const noOfInvites = $(this).find("td").eq(3).text();
            data.push({
              drawNo,
              minimumCRS,
              dateOfDraw,
              noOfInvites,
            });
          });
      });

      // FILTERING DATA so that online draws from
      // 2023 are added
      data = data.filter((data) => data.drawNo > 237);

      // Inserting Data in MongoDB
      insertDraw(data);

      //TODO: send tweet
    })
    .catch((err) => () => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
};

//////////////////////////////////////////////////////////////////////////////////////////
// DEFINING CREATE NEW DRAW IN DB FUNCTION
//////////////////////////////////////////////////////////////////////////////////////////

// TODO: find way to stop it from inserting duplicate docs
const insertDraw = asyncHandler(async (drawData, res) => {
  const newDraw = await Draw.create(drawData);
  if (newDraw) {
    console.log(newDraw);
  } else {
    console.log("ERROR");
  }
});

//////////////////////////////////////////////////////////////////////////////////////////
// WEBSCRAPER EXECUTION MAIN BODY
//////////////////////////////////////////////////////////////////////////////////////////
console.log("App Started...".yellow);
connectDB(getData());

//////////////////////////////////////////////////////////////////////////////////////////
// API ENDPOINT
//////////////////////////////////////////////////////////////////////////////////////////
app.get(
  "/",
  asyncHandler(async (req, res) => {
    const draws = await Draw.find();
    res.status(200).json(draws);
  })
);

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

//TODO: make architecture diagram
//TODO: make 2 express servers
//TODO: web scraper run locally and run twitter
//TODO: foreach add make axios request to mongo to post
//TODO: link with Twitter bot
//TODO: other to handle display of data; REACT?
//TODO: make routes to show webpage
//TODO: add chart
//TODO: deploy
