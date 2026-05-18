require("dotenv").config();
const app = require("./app");
const connectToDb = require("./config/db");

connectToDb();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server connected on port ${port}`);
});
