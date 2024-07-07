const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 2345;

const directoryPath = './drive'; // Đường dẫn thư mục chứa file

// Thiết lập EJS làm template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// *** Đặt express.static() trước các route khác ***
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

// Route hiển thị danh sách file
app.get('/', (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Lỗi đọc thư mục:', err);
      return res.status(500).render('error', { error: 'Lỗi server' });
    }

    const fileList = files.filter(file => {
      return fs.statSync(path.join(directoryPath, file)).isFile();
    });
const filesWithExtensions = fileList.map(file => ({
      name: file,
      extension: getFileExtension(file)
    }));
    res.render('index', { files: fileList });
  });
});
function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
