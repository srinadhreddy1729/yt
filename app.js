
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const http = require('http');
// const socketIo = require('socket.io');
// const routes = require('./src/routes/allroutes');
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//     },
//     transports: ['websocket', 'polling'],
// });

// dotenv.config();
// const PORT_NUMBER = process.env.PORT_NUMBER || 9090; 

// mongoose.connect("mongodb://127.0.0.1:27017/DosthiApplicationDatabase").then(() => {
//     console.log("Database connected");
// }).catch(err => {
//     console.error("Database connection error:", err);
// });

// app.use(cors({ origin: "*" }));
// app.use(express.json());

// app.set('view engine', 'ejs');
// app.use("/api", routes);

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('join', (roomId) => {
//         console.log(`${socket.id} joined room ${roomId}`);
//         socket.join(roomId);
//         socket.to(roomId).emit('user-connected', socket.id);
//     });

//     socket.on('offer', (roomId, offer) => {
//         console.log(`Offer from ${socket.id} to room ${roomId}`);
//         socket.to(roomId).emit('offer', offer);
//     });

//     socket.on('answer', (roomId, answer) => {
//         console.log(`Answer from ${socket.id} to room ${roomId}`);
//         socket.to(roomId).emit('answer', answer);
//     });

//     socket.on('ice-candidate', (roomId, candidate) => {
//         console.log(`ICE candidate from ${socket.id} to room ${roomId}`);
//         socket.to(roomId).emit('ice-candidate', candidate);
//     });

//     socket.on('chat-message', (roomId, message) => {
//         console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
//         socket.to(roomId).emit('chat-message', message);
//     });

//     socket.on('disconnect', () => {
//         console.log('A user disconnected:', socket.id);
//     });
// });

// server.listen(PORT_NUMBER, () => {
//     console.log(`Server is running on port ${PORT_NUMBER}`);
// });






const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./src/models/User');
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profiles');
const routes = require('./src/routes/allroutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/DosthiApplicationDatabase", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
 app.use("/api", routes);


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', socket.id);
    });

    socket.on('offer', (roomId, offer) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('chat-message', (roomId, message) => {
        socket.to(roomId).emit('chat-message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(9090, () => {
    console.log("Server is running on port 9090");
});
