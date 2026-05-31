FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=4000
EXPOSE 4000
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4000"]