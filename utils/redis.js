#!/usr/bin/env node

import { createClient } from 'redis';

class RedisClient{
	/**
	 * this function creates redis client connection by
	 * creationg a new redis client 
	 * handling errors and 
	 * connecting to the redis server
	 */
	constructor(){
		this.client = createClient();
		this.client.on('error', (err) => console.error('Redis Client Error', err));
		this.client.connect();
	}
	/**
         * should check if redis client is connected 
	 * and return true if client is connected
         */
	
	isAlive(){
		 return this.client.isReady;
	}
	/**
         * using async function to get the value of a given key from redis
	 * and logs any errors occured 
         */
	async get(key){
		try{
			const value = await this.client.get(key);
			return value;
		}
		catch(error){
			console.error('Error fetching key from Redis:', error);
			return null;
		}
	}
	/**
         * this async function set the key-value with an expiry time
	 * and logs errors if the occur
         */
	async set(key, value, duration){
		try{
			await this.client.set(key, value, { EX: duration });
		}
		catch(error){
			console.error('Error setting key in Redis:', error);
                        return null;
		}
	}
	/**
         * using async function to delete key in redis
         */
	async del(key){
		try{
			await this.client.del(key);
		}
		catch(error){
			console.error('Error deleting key from Redis:', error);
		}
	}
}

/**
 * creating a redis client instance and using it in other parts of the application
 */
const redisClient = new RedisClient();
export default redisClient;

