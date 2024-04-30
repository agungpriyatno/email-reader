FROM oven/bun:latest
WORKDIR /app

COPY . .
RUN bun install --platform=linux/amd64
RUN bunx prisma generate
RUN bun run build

EXPOSE 3000/tcp
CMD ["bun", "run", "start"]
