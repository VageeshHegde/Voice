const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3030;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/voiceAssistant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a schema and model for messages
const messageSchema = new mongoose.Schema({
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema); // This will use the "messages" collection in MongoDB

// API endpoint to save a message
app.post('/api/messages', async (req, res) => {
    const { text } = req.body;
    const message = new Message({ text });
    await message.save();
    res.status(201).send(message);
});

// Serve the Voice.html file when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Voice.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
