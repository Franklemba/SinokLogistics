const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    messages:{
        type:Array,
        default:[]
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    lastMessageOpened:{
        type:Boolean,
        default:false
    },
    senderName: {
        type: String,
        required: false
    },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;