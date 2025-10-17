FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb ./
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM node:20-alpine AS serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
