FROM oven/bun:latest
WORKDIR /app

COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000/tcp
CMD ["npm", "run", "start"]
