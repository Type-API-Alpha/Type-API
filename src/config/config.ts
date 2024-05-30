import dotenv from "dotenv";
dotenv.config();

const config = {
	PORT: Number(process.env.PORT),

    DB_USER: process.env.DB_USER,
	DB_HOST: process.env.DB_HOST,
    DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: Number(process.env.DB_PORT)
}

export default config;