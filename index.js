import express from "express";
const app = express();

const PORT = 4000;

const handleListening = () => {
  console.log(`Listening on: http://localhost:${PORT}`);
};

const handleHome = (req, res) => {
  res.send("Hello Home");
};

const handleProfile = (req, res) => {
  res.send("You are on my profile");
};

app.get("/profile", handleProfile);
app.get("/", handleHome);
app.listen(PORT, handleListening);
