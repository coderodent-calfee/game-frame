import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});