FROM oven/bun


COPY . .
RUN bun install
RUN bun run build


EXPOSE 3000
CMD ["bun", "run", "start"]