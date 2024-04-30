FROM oven/bun
WORKDIR /app

COPY . .
RUN bun install
RUN bunx dotenv -e .env.production -- bunx prisma generate
RUN bun run build


EXPOSE 3000
CMD ["bun", "run", "start"]