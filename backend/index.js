require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model")

const express = require("express");
const cors = require("cors");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();

// const jwt = require("JsonWebToken");
const { authenticateToken } = require("./utilities")
app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "Hello World!" });
});
// create account
app.post("/createAccount", async (req, res) => {
    const { fullname, password, email } = req.body;
    if (!fullname) {
        return res
            .status(400)
            .json({ error: true, message: "Please enter your full name" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Please enter your email" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "password is required" });
    }
    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exist",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "360000m",
    });
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration successfull",
    })
});
app.listen(8000);
module.exports = app;