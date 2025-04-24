const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // or your MongoDB URI
const client = new MongoClient(uri);

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db('APM_Main_DB'); // Replace with your database name
        const tasksCollection = db.collection('APM_Tasks_Collection');
        const usersCollection = db.collection('APM_Users_Collection');



        return { tasksCollection, usersCollection };
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

module.exports = connectToMongo;