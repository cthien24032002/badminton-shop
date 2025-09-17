# Sử dụng image Node.js 24 chính thức (alpine để nhẹ hơn)
FROM node:24-alpine

# Cập nhật và cài đặt các gói cần thiết trên Alpine
RUN apk update && apk upgrade --no-cache

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng NestJS
RUN npm run build

# Chạy ứng dụng với port 1051
EXPOSE 1051

# Command để chạy ứng dụng
CMD ["npm", "run", "start:prod"]