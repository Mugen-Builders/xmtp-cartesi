const express = require('express');
const cors = require('cors');
const app = express();
const [fetchAndSendLatestNotice] = require('./graphqlClient.js');

const PORT = 3000;

app.use(cors());
app.use(express.json());



app.get('/test', function (req, res) {
    res.send('Hello World! This is a test endpoint after updates');
})

app.listen(PORT, function () {
    console.log(`server listening on port ${PORT}`);
});


fetchAndSendLatestNotice();