
import * as dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoutes.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});