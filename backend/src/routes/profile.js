const express = require("express")
const validator = require("validator");
const profileRouter= express.Router()
const bcrypt = require("bcrypt")
const { userAuth } = require("../middlewares/auth");
const { validateEditProfilData } = require("../utils/validation");


profileRouter.get("/profile",userAuth, async (req, res) => {
  try {   
    const user = req.user
    res.send(user)
  } catch (error) {
    res.status(401).send("Invalid or expired token: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // 1️⃣ Validate edit fields
    const isEditAllowed = validateEditProfilData(req);
    if (!isEditAllowed) {
      return res.status(400).json({
        error: "Invalid edit request",
      });
    }

    // 2️⃣ Logged-in user from auth middleware
    const loggedInUser = req.user;

    // 3️⃣ Update allowed fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // 4️⃣ Save changes
    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName} profile updated successfuly`,
      user: loggedInUser,
    });

  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try {
    const user=req.user;
    res.send(user)
  } catch (error) {
    res.status(400).send("ERROR: ",error.message)
  }
})

profileRouter.post("/profile/password",userAuth,async (req,res)=>{
  try {
    const { password: newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "Password is required" });
    }
     if (!validator.isStrongPassword(newPassword)) {
        throw new Error(
          "Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, number, and symbol."
        );
      }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const loggedInUser = req.user;

    // 3️⃣ Update allowed fields
    loggedInUser.password=passwordHash
    await loggedInUser.save();
    res.status(201).send("PAssword updated successfuly")

  } catch (error) {
    res.status(400).send("ERROR: " + error.message)
  }
})

module.exports=profileRouter