#!/usr/bin/env node

const { createClient } = require('redis');

class RedisClient {	 
	/**
	 * Creates a Redis client, handles errors, and connects to the Redis server.
	 */
	constructor() {
		this.client = createClient();
		this.isClientConnected = true;
		this.client.on('error', (err) => {
			console.error('Redis client failed to connect:', err.message || err.toString());
			this.isClientConnected = false;
		});
		this.client.on('connect', () => {
			this.isClientConnected = true;
		});
	}  
	
	/**
	 * Checks if the Redis client is connected and returns true if it is.
	 */

	isAlive() {
		return this.isClientConnected;
	}

	get(key) {
		return new Promise((resolve, reject) => {
			this.client.get(key, (err, result) => {
				if (err) {
					console.error('Error fetching key from Redis:', err);
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	/**
	* the following function: 
	* Retrieves the value of a given key from Redis.
	* Sets a key-value pair in Redis with an expiry time.
	* Deletes a key from Redis.
	* Logs any errors that occur.
	*/

	set(key, value, duration) {
		return new Promise((resolve, reject) => {
			this.client.set(key, value, 'EX', duration, (err) => {
				if (err) {
					console.error('Error setting key in Redis:', err);
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}

	del(key) {
		return new Promise((resolve, reject) => {
			this.client.del(key, (err) => {
				if (err) {
					console.error('Error deleting key from Redis:', err);
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	}
}

/**
 * Creating a Redis client instance to be used in other parts of the application.
 */

const redisClient = new RedisClient();
module.exports = redisClient;

