// controllers/AppController.js
const redis = require('redis');
const dbClient = require('../utils/db'); // Assuming dbClient is exported from utils/db.js

// Create Redis client
const redisClient = redis.createClient();

module.exports = {
    async getStatus(req, res) {
        try {
            // Checking Redis status
            redisClient.ping((err, response) => {
                const redisStatus = response === 'PONG';

                // Checking DB status
                dbClient.isAlive().then(dbStatus => {
                    res.status(200).json({
                        redis: redisStatus,
                        db: dbStatus
                    });
                }).catch(err => {
                    res.status(500).json({ error: 'Database check failed' });
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Redis check failed' });
        }
    },

    async getStats(req, res) {
        try {
            const usersCount = await dbClient.nbUsers();
            const filesCount = await dbClient.nbFiles();

            res.status(200).json({
                users: usersCount,
                files: filesCount
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve stats' });
        }
    }
};

