# Web File Manager Server

Ứng dụng Node.js đơn giản để quản lý và tải xuống file từ server.

## Cài đặt

1. **Clone project:**
   ```bash
   git clone https://github.com/quockhanh2004/web-file-manager-server.git
   ```

2. **Di chuyển vào thư mục project:**
   ```bash
   cd web-file-manager-server
   ```

3. **Cài đặt dependencies:**
   ```bash
   npm i
   ```

## Cấu hình

**Tạo liên kết (symbolic link) đến thư mục chứa file:**

```bash
ln -s /đường/dẫn/đến/thư/mục/chứa/file drive 
```

-  Thay thế `/đường/dẫn/đến/thư/mục/chứa/file` bằng đường dẫn thực tế đến thư mục bạn muốn quản lý trên server.
-  Lệnh này sẽ tạo một liên kết tượng trưng `drive` trong thư mục project, trỏ đến thư mục chứa file của bạn.

## Chạy ứng dụng

```bash
npm start
```

-  Ứng dụng sẽ chạy tại `http://localhost:2345` (hoặc cổng được chỉ định trong code).
-  Hệ thống sẽ tự động reload khi bạn thay đổi code nhờ vào `nodemon`.

## Sử dụng

-  Truy cập `http://localhost:2345` trong trình duyệt.
-  Ứng dụng sẽ hiển thị danh sách file và thư mục trong thư mục bạn đã liên kết đến.
-  Click vào tên thư mục để mở thư mục con.
-  Click vào tên file để tải xuống file. 

