const mongoose = require("mongoose");
if(mongoose.connection.models['User']){
  delete mongoose.connection.models['User']
}

const clientSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountStatus:{
    type: String,
    required: true,
    default:'active'
  },
  createdAt:{
    type: Date,
    required: true,
    default: Date.now
  },
   verificationToken:{
  type:String,
  required:false

 }
});


module.exports = mongoose.model("User", clientSchema);
