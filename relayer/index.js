import express from 'express';
import { fetchAndSendLatestNotice } from './graphqlClient.js';
const app = express();
const PORT = process.env.PORT || 3000;

setInterval(fetchAndSendLatestNotice, 10000);

app.get('/', (req, res) => {
    res.send('GraphQL listener is running. Check the console for notices.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
