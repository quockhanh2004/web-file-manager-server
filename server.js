const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 2345;

// Function để lấy phần mở rộng của file
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

// Thiết lập EJS làm template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Đặt express.static() trước các route khác 
app.use(express.static('public')); 

// Route để phục vụ file CSS từ thư mục 'views'
app.get('/views/style.css', (req, res) => {
  res.sendFile(__dirname + '/views/style.css');
});

// Route để xử lý download file
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'drive', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File không tồn tại:', err);
      return res.status(404).send('File không tìm thấy');
    }
    res.download(filePath);
  });
});

// Route hiển thị danh sách file và folder
app.get('/', (req, res) => {
  const currentDir = req.query.dir || '';
  const directoryPath = path.join(__dirname, 'drive', currentDir);	

  fs.readdir(directoryPath, (err, items) => {
    if (err) {
      console.error('Lỗi đọc thư mục:', err);
      return res.status(500).render('error', { error: 'Lỗi server' });
    }

    const itemsWithDetails = items.map(item => {
  const itemPath = path.join(directoryPath, item);
  const stat = fs.statSync(itemPath);
  return {
    name: item,
    extension: getFileExtension(item),
    isDirectory: stat.isDirectory(),
    path: path.join(currentDir, item) // Thêm thuộc tính path
  };
});

res.render('index', { 
    items: itemsWithDetails, 
    currentDir, 
    parentDir: path.dirname(currentDir) // Thêm parentDir vào đây
  });

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
