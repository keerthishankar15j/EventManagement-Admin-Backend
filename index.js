const app = require("./App");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Admin Server running on port ${PORT}`);
});