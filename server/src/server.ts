import express from "express";
import cors from "cors";
import routes from "./routes";
import path from "path";
import {errors} from "celebrate"
import { celebrate } from "celebrate";

const app = express();

app.use(cors());
app.use(routes);

//static files route
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());

app.listen(7000);