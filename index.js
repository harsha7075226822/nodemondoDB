const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", userSchema);

app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    
    try {
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all documents from the User collection
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(5001, () => {
    console.log("Server is running on port 5000");
});
