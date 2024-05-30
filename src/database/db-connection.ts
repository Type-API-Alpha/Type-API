import { Pool } from "pg";
import dotenv from "dotenv";
import config  from "../config/config";

dotenv.config();

const dBConnection = new Pool({
	user: config.DB_USER,
	host: config.DB_HOST,
	database: config.DB_DATABASE_NAME,
	password: config.DB_PASSWORD,
	port:config.DB_PORT,
});

export default dBConnection;