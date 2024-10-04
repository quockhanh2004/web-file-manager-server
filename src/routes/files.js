const express = require("express");
const fs = require("fs");
const path = require("path");
const { getFileExtension, formatFileSize } = require("../utils/fileUtils");

const router = express.Router();

// Route xử lý download file
router.get("/download/*", (req, res) => {
  const decodedPath = decodeURIComponent(req.path);
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "drive",
    decodedPath.replace("/download", "")
  );
  let file = filePath.toString().split("/");
  //kiểm tra tên file có bắt đầu bằng dấu .
  if (file[file.length - 1].startsWith(".")) {
    return res
      .status(400)
      .send("Không được phép tải file này (file bắt đầu bằng dấu chấm)");
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File không tồn tại:", err);
      return res.status(404).send("File không tìm thấy");
    }
    // File tồn tại, cho phép tải xuống
    res.download(filePath);
  });
});

// Route hiển thị danh sách file và folder
router.get("/", (req, res) => {
  const currentDir = req.query.dir || "";
  const sortBy = req.query.sort || "name"; // Lấy tham số sort, mặc định là name
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

    // Sắp xếp danh sách items
    itemsWithDetails.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "type") {
        return a.isDirectory === b.isDirectory
          ? a.name.localeCompare(b.name)
          : a.isDirectory
          ? -1
          : 1;
      } else if (sortBy === "size") {
        return a.isDirectory === b.isDirectory
          ? a.size.localeCompare(b.size)
          : a.isDirectory
          ? -1
          : 1;
      }
    });

    res.render("index", {
      items: itemsWithDetails,
      currentDir,
      parentDir: currentDir ? path.dirname(currentDir) : "",
      sortBy,
    });
  });
});

module.exports = router;
