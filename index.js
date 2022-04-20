const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRoute = require('./routes/users.route');

app.use(express.static('static'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/bank', usersRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`application start at ${port}`));
