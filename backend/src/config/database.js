const mongoose = require('mongoose');

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://krishnabokefod_db_user:CodeMatch123@codematch.5maqxtu.mongodb.net/users")
}

module.exports=connectDB;

