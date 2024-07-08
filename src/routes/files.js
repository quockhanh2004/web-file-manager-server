const express = require("express");
const fs = require("fs");
const path = require("path");
const { getFileExtension, formatFileSize } = require("../utils/fileUtils");
const { log } = require("console");

const router = express.Router();

// Route xử lý download file
router.get('/download/*', (req, res) => {
  const decodedPath = decodeURIComponent(req.path);
  const filePath = path.join(__dirname, '..', '..', 'drive', decodedPath.replace('/download', ''));
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File không tồn tại:', err);
      return res.status(404).send('File không tìm thấy');
    }

    // File tồn tại, cho phép tải xuống
    res.download(filePath);
  });
});

// Route hiển thị danh sách file và folder
router.get("/", (req, res) => {
  const currentDir = req.query.dir || "";
  const directoryPath = path.join(__dirname, "..", "..", "drive", currentDir);

  fs.readdir(directoryPath, (err, items) => {
    if (err) {
      console.error("Lỗi đọc thư mục:", err);
      return res.status(500).render("error", { error: "Lỗi server" });
    }

    const itemsWithDetails = items.map((item) => {
      const itemPath = path.join(directoryPath, item);
      const stat = fs.statSync(itemPath);
      return {
        name: item,
        extension: getFileExtension(item),
        isDirectory: stat.isDirectory(),
        path: path.join(currentDir, item),
        size: stat.isFile() ? formatFileSize(stat.size) : "",
      };
    });

    res.render("index", {
      items: itemsWithDetails,
      currentDir,
      parentDir: currentDir ? path.dirname(currentDir) : "",
    });
  });
});

module.exports = router;
