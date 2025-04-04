const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const socketIoClient = require('socket.io-client');
const Conversation = require('./models/Conversation');

const adminSocket = socketIoClient('http://localhost:3003'); // Adjust the URL to match your admin server's address and port
// const adminSocket = socketIoClient('https://steadfastcargoadmin.onrender.com')
const http = require("http").createServer(app); // Create an HTTP server instance

const io = require("socket.io")(http); // Integrate Socket.IO with the server

const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const customerSupportRouter = require('./routes/customerSupport');

const { ensureAuthenticated } = require('./config/auth');

require('./config/passport')(passport);

const liveDB = "mongodb+srv://franklemba:kU3XmafGzdHYYzfX@cluster0.xnljw5s.mongodb.net/?retryWrites=true&w=majority"
const localDB = "mongodb://127.0.0.1:27017/steadfastCargo"
mongoose.connect(liveDB).then(()=>{
  console.log('database is connected')
}).catch((err)=> console.log('error connecting to database ',err))


//socket io
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected");
  // Emit initial messages to the newly connected client
 
  // Listen for messages from clients
  socket.on('joinchat', (userId)=>{
    socket.join(userId)
  })
  socket.on("clientMessage",async ({userId,message,sender,userRole}) => {
    try {
      

      // Find the conversation with the provided user ID
      let conversation = await Conversation.findOne({userId });

      if (!conversation) {
          // If conversation doesn't exist, create a new one
          conversation = new Conversation({
              userId,
              messages: [{ content: message,sender,userRole }], // Add the new message to the messages array,
              senderName:sender
          });
      } else {
          // If conversation exists, append the new message
          conversation.lastMessageOpened = false;
          conversation.messages.push({ content: message,sender,userRole });
      }

  // addMessage(message);
  socket.emit("sentClientApproval", {message,userRole,sender,userId});
  adminSocket.emit("clientMessage", {message,userRole,sender,userId});

      // Save the updated conversation
      await conversation.save();

     
  } catch (error) {
      console.error("Error sending message:", error);
     
  }
  });

   // Listen for messages from clients
   socket.on("adminMessageApproval", async({message,userRole,sender,userId}) => {
    // addMessage(message);
    console.log('recieced admin message')
    let conversation = await Conversation.findOne({userId });

    if (!conversation) {
        // If conversation doesn't exist, create a new one
        conversation = new Conversation({
            userId,
            messages: [{ content: message,userRole,sender }], // Add the new message to the messages array,
            senderName:sender
        });
        await conversation.save()
    } else {
        // If conversation exists, append the new message
        conversation.messages.push({ content: message,sender,userRole });
        conversation.lastMessageOpened = false;
        await conversation.save()
    }
    io.to(userId).emit("recievedAdminMessage", {message,userRole,sender});
  });

});



adminSocket.on('connect', () => {
  console.log('Connected to admin server');
  
  // You can emit events or listen for events from the admin server here
});

adminSocket.on('disconnect', () => {
  console.log('Disconnected from admin server');
});

// Configure the server
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.set('trust proxy', 1);

 // Session configuration
const sessionStore = MongoStore.create({ 
  mongoUrl: liveDB,
  ttl: 14 * 24 * 60 * 60 // 14 days
});


app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))


app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


app.use('/auth',authRouter);
app.use('/customerSupport',ensureAuthenticated,customerSupportRouter);
app.use('/', homeRouter);

app.use('*', (req, res) => {
    // Redirect to the main page or any desired page
    // res.redirect('/'); // You can replace '/' with the URL of your main page
    return res.render("home/errorPage", {
      errorMessage: `
                You may have mis-typed the URL. Or the page
                has been removed. <br>Actually, there is nothing to see here...
                `
    });
  });
  
  // Global error handling middleware
// app.use((err, req, res, next) => {

//     console.error(err.stack);
//     res.status(500).redirect('/'); // Redirect to the error page

// });
  
  function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000); // Convert to seconds
  }
  

  // Start the server
  http.listen(process.env.PORT || 3600, () => console.log('Server is Running on port 3600'));
  
  
