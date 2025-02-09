import express, { Request, Response } from "express";
import cors from 'cors';
import serveRoute  from '../src/routes/request-handler.route';
import uploadRoute from '../src/routes/upload.route';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
  res.send("Server is running!")
});

app.use('/api/serve' , serveRoute);
app.use('api/upload', uploadRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
