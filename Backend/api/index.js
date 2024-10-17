const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');

const app = express();
const port = 4000; // Define the port

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS middleware
app.use(cors({
    origin: 'https://money-tracker--mu.vercel.app', // Allow your frontend origin
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if the connection fails
    });

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'test ok' });
});

// Transaction POST route
app.post('/api/transaction', async (req, res) => {
    try {
        const { price, name, description, datetime } = req.body;

        // Create new transaction in MongoDB
        const transaction = await Transaction.create({ price,   name, description, datetime });

        // Respond with the newly created transaction
        res.json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/transactions', async (req,res)=>{
    const transactions = await Transaction.find()
    res.json(transactions);
})


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
