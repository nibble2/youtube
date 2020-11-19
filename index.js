const express = require("express");
const app = express();

const PORT = 4000;

function handleListening() {
    console.log(`Listening on: http://localhost:${PORT}`);
}

function handleHome(req, res) {
    res.send("Hello Home");
}

function handleProfile(req, res) {
    res.send("Your on my profile");
}

app.get("/profile", handleProfile);
app.get("/", handleHome);
app.listen(PORT, handleListening);