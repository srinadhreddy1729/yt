
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const User = require('./src/models/User'); 
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/findfrnddatabase', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch(error => console.log(error));

const profileroutes = require('./src/routes/profileroutes');
const emailroutes = require('./src/routes/emailroutes');

app.use('/api/profile', profileroutes);
app.use('/api/email', emailroutes);

app.get("/data", (req, res) => {
    res.render('email');
});

app.post('/signin', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = (email === user.email);
    if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ email: user.email, nickname: user.nickname });
});

app.get('/users/:email', async (req, res) => {
    try {
        const users = await User.find({ email: { $ne: req.params.email } }, 'email nickname');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (roomId) => {
        console.log(`${socket.id} joined room ${roomId}`);
        socket.join(roomId);
    });

    socket.on('chat-message', (roomId, message) => {
        socket.to(roomId).emit('chat-message', message);
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

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = 3000; 
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
