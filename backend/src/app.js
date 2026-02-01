const express = require("express");
require("dotenv").config() 
const connectDB = require("./config/database");
const cors= require("cors")
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,              
};

app.use(cors(corsOptions));
const Users = require("./models/Users");
app.use(express.json());


const authRoute = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/users")
app.use("/",authRoute)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


connectDB()
  .then(() => {
    console.log("Database is established...");
    app.listen(process.env.PORT, () => {
      console.log("Port listening on 8080");
    });
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

//   get user by email
app.get("/users", async (req, res) => {
  const { email } = req.query;

  // 1️⃣ Validate query param
  if (!email) {
    return res.status(400).json({
      message: "Email query parameter is required"
    });
  }

  try {
    // 2️⃣ Use findOne since email should be unique
    const user = await Users.findOne({ email });

    // 3️⃣ Handle user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 4️⃣ Success response
    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

app.get("/feed",async(req,res)=>{
    try {
        const users = await Users.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send("Users not found")
        
    }
})

app.delete("/user", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("userId is required");
  }

  try {
    const user = await Users.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

// Update data of user
app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];
    
    // Check if all keys in request are allowed
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send({ error: "Update not allowed" });
    }

    // Update user
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      data,
      { new: true, runValidators: true } // return updated doc & run schema validators
    );

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User updated successfully", user: updatedUser });

  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message || "Something went wrong" });
  }
});











