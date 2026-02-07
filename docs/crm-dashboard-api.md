# API Documentation - CRM Dashboard & Loyalty Points

Tài liệu này cung cấp chi tiết các API mới phục vụ cho việc triển khai giao diện Dashboard và quản lý tích điểm trên hệ thống CRM.

---

## 1. Thống kê tăng trưởng người dùng

Sử dụng để vẽ biểu đồ tăng trưởng số lượng tài khoản theo thời gian.

- **Endpoint**: `GET /api/stats/user-growth`
- **Query Parameters**:
  - `unit` (Optional): Đơn vị thống kê. Nhận giá trị `day` (mặc định) hoặc `month`.
- **Response**: `Array<Object>`

```json
[
  {
    "date": "2024-02-01",
    "count": 10
  },
  {
    "date": "2024-02-02",
    "count": 15
  }
]
```

---

## 2. Tổng quan Dashboard (Summary)

Lấy các chỉ số tổng hợp nhanh để hiển thị các con số lớn (Cards) trên Dashboard.

- **Endpoint**: `GET /api/stats/dashboard-summary`
- **Response**: `Object`

```json
{
  "totalUsers": 1250,
  "totalPoints": 450000
}
```

---

## 3. Theo dõi tích điểm trên đơn hàng

Mỗi đơn hàng hiện tại có thêm trường `earnedPoints` để biết số điểm người dùng nhận được từ đơn hàng đó.

### Danh sách đơn hàng (Có tích điểm)

- **Endpoint**: `GET /api/orders/admin` (hoặc các API lấy danh sách Order khác)
- **Cấu trúc dữ liệu Order mới**:

```json
{
  "id": 123,
  "totalAmount": 100000,
  "status": "COMPLETED",
  "earnedPoints": 10000,
  "phone": "0987654321",
  "createdAt": "2024-02-07T08:00:00.000Z",
  ...
}
```

_Lưu ý: `earnedPoints` chỉ có giá trị khác 0 khi đơn hàng ở trạng thái `COMPLETED`._

---

## 4. Quản lý điểm người dùng

### Tìm kiếm & Xem điểm hiện tại

- **Endpoint**: `GET /api/user`
- **Cấu trúc dữ liệu User**:

```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "phone": "0987654321",
  "point": 25000,
  "isActive": true,
  ...
}
```

---

## Quy tắc tính điểm (Business Logic)

1. **Trạng thái kích hoạt**: Điểm chỉ được tính và cộng cho User khi Đơn hàng (`Order`) chuyển sang trạng thái `COMPLETED`.
2. **Tỷ lệ tích điểm**: **1/10 (10%)**.
   - Ví dụ: Đơn hàng 10.000 VNĐ -> Tích được 1.000 điểm.
3. **Hoàn trả**: Nếu đơn hàng chuyển từ `COMPLETED` sang trạng thái khác (nếu hệ thống cho phép qua admin), logic sẽ cần được xử lý thêm (hiện tại đang ưu tiên tích điểm khi hoàn thành).
