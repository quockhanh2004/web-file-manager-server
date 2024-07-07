const { log } = require('console');
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
// Route để phục vụ file CSS từ thư mục 'public' (nếu cần)
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/views/style.css'); 
});
// app.use((req, res, next) => {
//   const ext = path.extname(req.url);
//   if (ext === '.css') {
//     res.set('Content-Type', 'text/css');
//   }
//   next();
// });
// Route để xử lý download file
//Download thư mục gốc
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'drive' , filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File không tồn tại:', err);
      return res.status(404).send('File không tìm thấy');
    }
    res.download(filePath);
  });
});

//Download thư mục con (Err: k cho truyền data dirt lên params)
app.get('/download/:filename?dir=:dirt', (req, res) => {
  const filename = req.params.filename;
  const dirF = '/'+req.params.dirt;
  if (req.params.dir!=''){
  	const filePath = path.join(__dirname, String('drive'+dirF) , filename);
  }
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File không tồn tại:', err);
      return res.status(404).send('File không tìm thấy'+dirF);
    }
    res.download(filePath);
  });
});

// Route hiển thị danh sách file và folder
app.get('/', (req, res) => {
  const currentDir = req.query.dir || '';
  const directoryPath = path.join(__dirname, 'drive', currentDir);
  console.log(currentDir);

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
      //Save lastDir
      localStorage.setItem('lastDir',currentDir);
    });

    // Sửa lỗi thiếu dấu ngoặc đóng cho `res.render`
    res.render('index', { 
      items: itemsWithDetails, 
      currentDir, 
      parentDir: currentDir ? path.dirname(currentDir) : '' // Xử lý trường hợp parentDir rỗng
    }); 
  });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
