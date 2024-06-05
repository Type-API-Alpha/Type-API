import express, { Express } from "express";
import config from "./config/config";
import appRouter from "./routes";

const app: Express = express();
app.use(express.json());
app.use(appRouter);

app.listen(config.PORT, () => {
	console.log("Application running");
});
