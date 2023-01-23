//////////////////////////////////////////////////////////////////////////////////////////
// THIRD PARTY MODULES
//////////////////////////////////////////////////////////////////////////////////////////
require("dotenv").config();

const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

// Initialize app with express
const app = express();
console.log("App Started...");

//////////////////////////////////////////////////////////////////////////////////////////
// CONFIGURATIONS
//////////////////////////////////////////////////////////////////////////////////////////
// DB Config
// const DB = "mongodb+srv://santiago:OCIImJVgF3Jb2Ii0@mongodbserver.p6m24.mongodb.net/LEARNT?retryWrites=true&w=majority";
// Connect to Mongo
// mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
// let mongoDB = mongoose.connection;
// mongoDB.on("error", console.error.bind(console, "DB Connection Error: "));
// mongoDB.once("open", () => {
//   console.log("Connected to MongoDB...");
// });

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

    data = data.filter((data) => data.drawNo > 236);
    console.log(data);
    //foreach add make axios request to mongo to post
  })
  .catch((err) => () => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

//TODO: make architecture diagram
//TODO: make 2 express servers
//TODO: web scraper run locally and run twitter
//TODO: make mongodb
//TODO: foreach add make axios request to mongo to post
//TODO: link with Twitter bot
//TODO: other to handle display of data; REACT?
//TODO: make routes to show webpage
//TODO: add chart
//TODO: deploy
