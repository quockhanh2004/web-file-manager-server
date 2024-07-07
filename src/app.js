const express = require('express');
const path = require('path');
const fileRoutes = require('./routes/files');

const app = express();
const port = 2345;

// Thiết lập EJS và thư mục public
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sử dụng route cho /files
app.use('/files', fileRoutes); 

// Xử lý route / 
app.get('/', (req, res) => {
  res.redirect('/files'); 
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});