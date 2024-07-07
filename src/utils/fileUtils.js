const path = require('path');

// Hàm lấy phần mở rộng của file
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

// Hàm format kích thước file
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

module.exports = {
  getFileExtension,
  formatFileSize
};