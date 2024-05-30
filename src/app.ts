import express, { Express } from "express";
import config from "./config/config";
import dotenv from "dotenv";
import appRouter from "./routes";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(appRouter);

app.listen(config.PORT);