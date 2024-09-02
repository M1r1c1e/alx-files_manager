#!/usr/bin/env node
/**
 * A MongoDB client class to count users and file documents
 */
const { MongoClient } = require('mongodb');

class DBClient {
        constructor() {

                // Set up MongoDB connection details using environment variables or default values
                const host = process.env.DB_HOST || 'localhost';
                const port = process.env.DB_PORT || 27017;
                const database = process.env.DB_DATABASE || 'files_manager';
                const url = `mongodb://${host}:${port}/${database}`;


                // Create a new MongoDB client with unified topology
                this.client = new MongoClient(url, { useUnifiedTopology: true });

                // Connect to the MongoDB server with proper error handling
                this.client.connect()
                        .then(() => {
                                this.db = this.client.db(database); // Assign the database on successful connection
                                console.log('Connected to MongoDB');
                        })
                        .catch((err) => {
                                console.error('Error connecting to MongoDB:', err); // Log error if connection fails
                                this.db = null; // Set the database to null on failure
                        });
        }

        // Function to check if the MongoDB client is connected
        isAlive() {
                // Check if the topology is connected to determine connection status
                return this.client.topology && this.client.topology.isConnected();
        }

        // Asynchronous function to get the number of documents in the 'users' collection
        async nbUsers() {
                if (!this.db) return 0; // Return 0 if the database is not connected
                return this.db.collection('users').countDocuments(); // Count documents in 'users' collection
        }

        // Asynchronous function to get the number of documents in the 'files' collection
        async nbFiles() {
                if (!this.db) return 0; // Return 0 if the database is not connected
                return this.db.collection('files').countDocuments(); // Count documents in 'files' collection
        }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
