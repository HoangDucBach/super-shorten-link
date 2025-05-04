# SuperShort

- [SuperShort](#supershort)

## Thành viên

1. Hoàng Đức Bách - 22021210
2. Lê Vũ Việt Anh - 22021212
3. Bằng Văn Chiến - 22021195

## Tổng quan

SuperShort là dịch vụ rút gọn URL hiệu suất cực cao. Hệ thống sử dụng các mẫu kiến ​​trúc được tối ưu hóa để đảm bảo khả năng mở rộng, độ tin cậy và hiệu suất trong khi vẫn duy trì hiệu quả về chi phí.

### Tính năng chính

- **Rút gọn URL**: Chuyển đổi các URL dài thành liên kết ngắn, dễ quản lý
- **Chuyển hướng URL**: Chuyển hướng liền mạch từ liên kết đã rút gọn đến URL gốc

### Vấn đề

#### 1. URLs dài và phức tạp

- Khó chia sẻ, nhập sai và không thẩm mỹ
- Vượt quá giới hạn ký tự trên nhiều nền tảng
  
#### 2. Thách thức về hiệu năng

- Cần xử lý nhiều yêu cầu chuyển hướng với độ trễ thấp
- Yêu cầu đọc nhiều hơn ghi (tỷ lệ khoảng 10:1)

## Các chiến lược tối ưu

### Chiến lược tạo id

Sử dụng mã hóa **Base62** kết hợp với **Distributed Counter** để tạo ra ID duy nhất, vừa ngắn gọn, vừa có thể dùng làm short link mà không cần thêm lớp ánh xạ trong database.

#### **Mã hoá Base62**

- Đảm bảo số lượng lớn, ≈$3.5^{12}$ trước khi đệm thêm ```nonce```
- Đảm bảo độ dài tối là 7 kí tự

#### **Distributed Counter**

- Dùng để tạo ```nonce``` tăng dần độc nhất cho id
- Đảm bảo không có xung đột id

#### **Phân vùng thông minh**

- Hỗ trợ dùng chính short id để tính toán partion và phân tán lên database
- Phân tán đều các ID trên các partition (**SuperShort** hiện dùng 16 bảng) khác nhau (0-15)
- Tối ưu hóa việc sharding và truy vấn song song

> Hiệu quả
>
> - Ngắn gọn nhờ Base62
> - Duy nhất nhờ counter phân tán
> Dễ dàng dự đoán phân vùng lưu trữ dựa trên short id mà không cần lookup database
>

### Chiến lược cache
> - Triển khai cache-server bằng Redis
> - Cải thiện đáng kể thời gian truy xuất URL gốc từ short URL
> - Cho phép lưu trữ hơn 100.000 cặp key-value, sử dụng thuật toán LRU khi bộ nhớ đầy
### Chiến lược CQRS
> - Tách biệt xử lý nghiệp vụ lấy URL và tạo URL giúp chương trình phục vụ nhu cầu Query tốt hơn với số lượng yêu cầu đọc rất lớn
> - Sử dụng database riêng giúp giảm tải, đồng bộ dữ liệu thống nhất giữa 2 database
### Mở rộng với middle ware
(edge function và rate limitting)

> - Rate Limiting được áp dụng để hạn chế người dùng liên tục gửi yêu cầu làm tắc nghẽn hệ thống
> - Edge function giúp người dùng truy cập được short URL nhanh hơn bởi thông tin đường dẫn được lưu lại ở phía Front End, cũng như giảm tảm cho hệ thống
