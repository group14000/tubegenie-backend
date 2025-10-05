import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('Hello, TubeGenie Backend!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});