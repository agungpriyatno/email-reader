FROM node:alpine
WORKDIR /app

COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start"]
