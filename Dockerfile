FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Copy các file cấu hình package vào
COPY package*.json ./

# Cài đặt lại các package
RUN npm install --build-from-source

# Copy mã nguồn vào container
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
