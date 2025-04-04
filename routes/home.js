require("dotenv").config();
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Shipment = require("../models/shipmentSchema");
const Quotation = require("../models/quotationSchema");

router.get("/", async (req, res) => {
  const user = req.user;
  // const shipmentNumber = req.params.shipmentNumber;
  const shipment = await Shipment.findOne();

  res.render("home/homepage", {
    shipment: shipment,
    user,
  });
});


router.post("/shipment", async (req, res) => {
  // const shipmentId = req.params.shipmentId;
  const { shipmentNumber } = req.body;
  const shipment = await Shipment.findOne({ shipmentNumber: shipmentNumber });

  if (!shipment) {
    // Shipment not found, render an error page or a different page
    return res.render("home/errorPage", {
      errorMessage: "Shipment not found, enter correct shipment number" // Pass any relevant error message to the error page
    });
}


  res.render("home/shipmentPage",{
     shipment
  })

  // res.json(shipment);
});

router.get("/services", (req, res) => {
  const user = req.user;

  res.render("home/servicesPage", { user });
});

router.post("/quotation", async (req, res) => {
  const {
    freightType,
    incoTerms,
    cityOfDeparture,
    deliveryCity,
    grossWeight,
    dimension,
    userName,
    userEmail,
    userPhoneNumber,
    message } = req.body;
    


    const quotation = new Quotation({freightType,
      incoTerms,
      cityOfDeparture,
      deliveryCity,
      grossWeight,
      dimension,
      userName,
      userEmail,
      userPhoneNumber,
      message});

      try {
           await quotation.save();
           console.log('Quotation saved successfuly');
           res.json({ message: 'Data received successfully!', receivedData: req.body });

      } catch (error) {
        console.error(`Error registering user: ${error.message}`);
        return res.render("home/errorPage", {
          errorMessage: error.message
        });
      }

});


module.exports = router;
