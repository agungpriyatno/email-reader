FROM oven/bun

# Copy the lock and package file
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile
RUN bun run build

# Copy your source code
# If only files in the src folder changed, this is the only step that gets executed!

CMD ["bun", "run", "start"]