import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT || 4000,
    REDIS_PORT: parseInt(process.env.REDIS_POST || "6379",10) ,
    REDIS_HOST: process.env.REDIS_HOST || "localhost"
}
