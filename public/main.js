const socket = io();

const clientstotal = document.getElementById('clients-total');
const msgContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

//const messTone = new Audio('/filename')

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('client-total', (data)=>{
    clientstotal.innerText = `Total Client: ${data}`;
});

function sendMessage(){
    if(messageInput.value === '') return
    //console.log(messageInput.value);
    const data = {
        name : nameInput.value,
        message : messageInput.value,
        dateTime : new Date()
    }

    socket.emit('message', data);
    addMessageToUI(true,data)
    messageInput.value = "";
}

socket.on('chat-message',(data)=>{
    //console.log(data)
   // messTone.play();
    addMessageToUI(false, data);
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback();
    const element =`
            <li class="${isOwnMessage ? "message-right" : "message-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name} - ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>`
    msgContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom(){
    msgContainer.scrollTo(0, msgContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback', {
        feedback : `${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback', {
        feedback : `${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback', {
        feedback : ``,
    })
})

socket.on('feedback' , (data)=>{
    clearFeedback()
    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>`
    msgContainer.innerHTML += element;

})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element)
    })
}