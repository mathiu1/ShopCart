const app = require("./app");

const connectDatabase = require("./config/database");

connectDatabase();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server listening to the port :${process.env.PORT} in ${process.env.NODE_ENV} `
  );
});


if (process.env.NODE_ENV === "Production") {
  require("./ping.js");
}


process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Shutting down the server due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Shutting down the server due to uncaught Exception");
  server.close(() => {
    process.exit(1);
  });
});
