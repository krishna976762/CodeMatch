const validator = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, number, and symbol."
    );
  }

  return true;
};

const validateEditProfilData = (req) =>{
    const allowedEditFields = ["firstName","lastName","about","photoUrl","gender","age","skills"]
    const isEditAllowed = Object.keys(req.body).every(field=> allowedEditFields.includes(field))
    return isEditAllowed
}

module.exports = {validationSignUpData,validateEditProfilData};
