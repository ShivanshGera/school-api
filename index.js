const express = require("express");
const cors = require("cors");
require("dotenv").config();

// import routes
const schoolRoutes = require("./routes/schoolRoutes");

// initialize app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api", schoolRoutes);

// basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});