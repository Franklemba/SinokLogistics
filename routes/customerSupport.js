require("dotenv").config();
const express = require("express");
const router = express.Router();
const Conversation = require('../models/Conversation')

router.get("/", async(req, res) => {
    const user = req.user;
    const conversation = await Conversation.findOne({userId: user._id});

    const messages = conversation?.messages;
        
    console.log(user)
    
        res.render("home/customerSupport", {
            user,
messages

        });
  });


  router.post("/message", async (req, res) => {
      try {
            const userId = req.user._id;

          const {message } = req.body;
  
          // Check if a conversation with the provided user ID exists
          let conversation = await Conversation.findOne({ userId });
  
          if (!conversation) {
              // If conversation doesn't exist, create a new one
              conversation = new Conversation({
                  userId,
                  messages: [{ content: message, sender:'User'}] // Add the new message to the messages array
              });
          } else {
              // If conversation exists, append the new message
              conversation.messages.push({ content: message, sender:'User' });
          }
  
          // Save the updated conversation
          await conversation.save();
  
          res.status(200).json({ message: "Message saved successfully" });
      } catch (error) {
          console.error("Error saving message:", error);
          res.status(500).json({ error: "Failed to save message" });
      }
  });


  module.exports = router;
