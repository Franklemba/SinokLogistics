const mongoose = require("mongoose");

if(mongoose.connection.models['Shipment']){
  delete mongoose.connection.models['Shipment']
}

const shipmentSchema = new mongoose.Schema({
  shipmentNumber: {
    type: String,
    required: true,
  },
  customerTotal: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  currentHub: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: true,
  },
  createdAt:{
      type: Date,
      required: true,
      default: Date.now
   },
});



module.exports = mongoose.model("Shipment", shipmentSchema);




