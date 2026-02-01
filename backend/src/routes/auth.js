const express = require("express")
const bcrypt = require("bcrypt")
const jwt= require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const Users = require("../models/Users");

const {validationSignUpData} = require("../utils/validation");

const authRoute = express.Router()
authRoute.use(cookieParser())

authRoute.post("/signup", async (req, res) => {
  try {
    // 1️⃣ Validate the input first
    validationSignUpData(req);

    // 2️⃣ Destructure needed fields
    const { firstName, lastName, email, password, age, gender, about, skills, photoUrl } = req.body;


    // 3️⃣ Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4️⃣ Create new user instance with all fields
    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      about,
      skills,
      photoUrl
    });

    // 5️⃣ Save user to DB
    await newUser.save();

    // 6️⃣ Send success response
    res.status(201).json({
      message: "User created successfully",
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        about: newUser.about,
        skills: newUser.skills,
        photoUrl: newUser.photoUrl,
      },
    });
  } catch (err) {
    // 7️⃣ Handle validation & DB errors
    res.status(400).json({ error: err.message });
  }
});


authRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password required");
    }

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send("Email Id is not present");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Password is not correct");
    }

    // ✅ Generate JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ Set JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,      // JS cannot read the cookie
      secure: false,       // true if using HTTPS
      sameSite: "lax",     // adjust for frontend if needed
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("token",token,{httpOnly:true})
    res.status(200).json({ message: "Login successful",data:user });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRoute.post("/logout",async(req,res)=>{
res.cookie("token",null,{expires: new Date(Date.now())})
res.send("Logout successfuly")
})

module.exports=authRoute;