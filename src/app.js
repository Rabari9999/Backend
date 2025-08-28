import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({limit:"16kb"}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"))





export default app;