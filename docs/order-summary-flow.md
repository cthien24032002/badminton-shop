# Tài liệu API - Thống kê Tổng doanh thu và Luồng chuyển trạng thái đơn hàng

Hệ thống cung cấp API để thống kê tổng giá trị đơn hàng theo trạng thái và xử lý các nghiệp vụ tự động khi thay đổi trạng thái đơn hàng (tích điểm, hoàn kho).

---

## 1. API Thống kê tổng giá trị đơn hàng

Dùng để lấy tổng số tiền của tất cả các đơn hàng thuộc một trạng thái cụ thể.

- **Endpoint**: `GET /api/orders/total/:orderStatus`
- **Path Parameter**:
  - `orderStatus`: Trạng thái đơn hàng (`NEW`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`).
- **Response**:

```json
{
  "statusCode": 200,
  "data": {
    "orders": 1500000
  },
  "message": "Lấy thông tin đơn hàng thành công"
}
```

---

## 2. Luồng xử lý khi Chuyển trạng thái đơn hàng

Khi thực hiện `PATCH /api/orders/status/:id`, hệ thống không chỉ cập nhật database mà còn thực hiện các logic sau:

### A. Chuyển sang trạng thái hoàn thành (COMPLETED)

Khi đơn hàng chuyển từ trạng thái khác sang `COMPLETED`:

1. **Tính điểm thưởng**: Hệ thống tính `earnedPoints = totalAmount * 10%`.
2. **Cập nhật User**: Cộng dồn số điểm này vào tài khoản của khách hàng (dựa trên số điện thoại).
3. **Lưu vết đơn hàng**: Ghi lại số điểm đã tặng vào trường `earnedPoints` của đơn hàng đó.

### B. Chuyển sang trạng thái hủy (CANCELLED)

Khi đơn hàng chuyển từ trạng thái khác sang `CANCELLED`:

1. **Hoàn kho (Stock Return)**: Hệ thống tự động duyệt qua danh sách sản phẩm trong đơn hàng.
2. **Cập nhật số lượng**: Cộng lại số lượng sản phẩm tương ứng vào kho (`stock`) của từng sản phẩm.

---

## 3. Cơ chế bảo mật dữ liệu (Transaction & Locking)

Tất cả các thay đổi trạng thái được thực hiện trong một **Database Transaction** với cơ chế **Pessimistic Write Lock**:

- Ngăn chặn việc nhiều admin cập nhật cùng một đơn hàng đồng thời.
- Đảm bảo tính chính xác của dữ liệu Point và Stock khi có lượng truy cập cao.
- Nếu có bất kỳ lỗi nào xảy ra trong quá trình cộng điểm hoặc hoàn kho, toàn bộ thay đổi sẽ được Rollback về trạng thái cũ.

---

## 4. Danh mục Trạng thái (Enum)

| Giá trị      | Ý nghĩa                             |
| :----------- | :---------------------------------- |
| `NEW`        | Đơn hàng mới tạo                    |
| `PROCESSING` | Đang xử lý                          |
| `SHIPPED`    | Đang giao hàng                      |
| `COMPLETED`  | Đã hoàn thành (Kích hoạt tích điểm) |
| `CANCELLED`  | Đã hủy (Kích hoạt hoàn kho)         |
