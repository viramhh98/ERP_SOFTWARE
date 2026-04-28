// Load environment variables from .env file
require('dotenv').config();

const Port = process.env.PORT || 3000;
const JwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
const MongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';
module.exports = { Port, JwtSecret, MongoURI };