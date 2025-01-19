"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require('ioredis');
const options = {
    // port: config.redis.REDIS_PORT,
    // host: config.redis.REDIS_URL,
    // username: config.redis.REDIS_USERNAME,
    // password: config.redis.REDIS_PASSWORD,
    port: 6379,
    host: "redis",
    //   host: "localhost",
    family: 4,
    db: 0,
};
// const options = {};
const redis = new Redis(options);
exports.default = redis;
