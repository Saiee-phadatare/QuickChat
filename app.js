const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const server = app.listen(PORT, ()=>{ console.log(`Server started on ${PORT}`); });
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let socketsConnected = new Set();

io.on('connection',onConnected)

function onConnected(socket){
    //console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('client-total', socketsConnected.size);

    socket.on('disconnect' ,()=>{
        //console.log('Socket Disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('client-total', socketsConnected.size);

    });

    socket.on('message', (data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })

}

