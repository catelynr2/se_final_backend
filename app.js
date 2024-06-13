require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const { errors } = require("celebrate");

const errorHandler = require("./middlewares/errorHandler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cookieParser());

mongoose.connect(
  "mongodb://localhost:3000/",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB Error", e)
);

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
