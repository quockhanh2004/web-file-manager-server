const express = require('express');
const path = require('path');
const fileRoutes = require('./routes/files');
const morgan = require('morgan'); 
const moment = require('moment-timezone');

const app = express();
const port = 2345;

// Thiết lập EJS và thư mục public
morgan.token('vn-time', () => {
  return moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan(`:vn-time| :method :url status::status :response-time ms`));

// Sử dụng route cho /files
app.use('/', fileRoutes); 

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});