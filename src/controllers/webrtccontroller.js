const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors(
    {
        origin:"*"
    }
))

const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/user_profiles');

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  profilePicture: String,
});

const User = mongoose.model('User', userSchema);

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
app.post('/signup', upload.single('profilePicture'), async (req, res) => {
  const { name, password } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  try {
    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      password: hashedPassword,
      profilePicture
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/signin', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  res.json({ name: user.name, profilePicture: user.profilePicture });
});

app.get('/users/:name', async (req, res) => {
  try {
    const users = await User.find({ name: { $ne: req.params.name } }, 'name profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// WebRTC and chat signaling
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


app.get("/data",(req,res)=>
    {
        res.json({message:"its working....."})
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








