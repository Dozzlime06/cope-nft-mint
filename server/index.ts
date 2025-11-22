import express from 'express';
import { router } from './routes';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api', router);

// Serve frontend in production or with built assets
app.use(express.static('dist/public'));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(process.cwd() + '/dist/public/index.html', (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[express] serving on port ${PORT}`);
});
