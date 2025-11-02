import express from 'express';
import catalogRouter from './api/rest/catalog.routes';



const PORT=process.env.PORT||8000;

const app = express();

app.use(express.json());

app.use("/", catalogRouter);



export default app;