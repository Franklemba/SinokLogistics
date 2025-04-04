const mongoose = require("mongoose");
if(mongoose.connection.models['Quotation']){
  delete mongoose.connection.models['Quotation']
}

const quotationSchema = new mongoose.Schema({
  freightType: {
    type: String,
    required: true,
  },
  incoTerms: {
    type: String,
    required: true,
  },
  cityOfDeparture: {
    type: String,
    required: true,
  },
  deliveryCity:{
    type: String,
    required: true,
  },
  grossWeight:{
    type: String,
    required: true,
  },
  dimension:{
    type: String,
    required: true,
  },
  userName:{
    type: String,
    required: true,
  },
  userEmail:{
    type: String,
    required: true,
  },
  userPhoneNumber:{
    type: String,
    required: true,
  },
  message:{
    type: String,
    required: false,
  },
  createdAt:{
    type: Date,
    required: true,
    default: Date.now
  }
});


module.exports = mongoose.model("Quotation", quotationSchema);
