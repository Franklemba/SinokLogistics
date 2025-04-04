const socket = io();
// const adminSocket = socketIoClient('http://localhost:3600'); // Adjust the URL to match your admin server's address and port

socket.on('connect', () => {
  console.log('new connection from  client server');
  const userId = document.getElementById('userId').value
  
 socket.emit('joinchat',userId)
  // You can emit events or listen for events from the admin server here
});



// adminSocket.on('disconnect', () => {
//   console.log('Disconnected from admin server');
// });

const sendMessageButton = document.getElementById("sendMessageButton")

sendMessageButton.addEventListener('click',()=>{


    const message = document.getElementById('messageContainer').value
    const sender = document.getElementById('userName').value
    const userId = document.getElementById('userId').value

    sendMessage({message, userId,sender})

})


  

  socket.on("sentClientApproval", ({message, userRole, sender}) => {
    
    console.log(message, userRole, sender)
    printMessage({message, userRole, sender})

    
    });
    
    socket.on("recievedAdminMessage", ({message, userRole, sender}) => {
    console.log('lll')
      console.log(message, userRole, sender)
      printMessage({message, userRole, sender})
  
      
      });
      


                // <div class="message user-message">
                //     You: Hi! I have a question about your products.
                // </div>


function printMessage({message, userRole, sender}){

  const messageString = document.createElement('div')
  
  messageString.innerHTML =
  `
  <div class="message ${userRole}">
     ${message}
</div>
  `;

  const chatMessages = document.getElementById('chat-messages');
  chatMessages.appendChild(messageString);
  document.getElementById('messageContainer').value = ''
  
chatMessages.scrollTop = chatMessages.scrollHeight;

}


function sendMessage({message,userId,sender}){
  if(message == ''){
    alert('Type message before sending')
  }else{

    socket.emit("clientMessage", ({message,userId,sender,userRole:'user-message'}))
  }

      
}