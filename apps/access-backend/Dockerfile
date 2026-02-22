FROM node:lts-alpine AS base
ENV APP_NAME=access-backend

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps


###### BUILD ######
FROM base AS build
RUN npx nx build access-backend


###### PRODUCTION ######
FROM node:lts-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist/apps/access-backend .
RUN npm install --only=production
COPY --from=build /app/apps/access-backend/prisma ./apps/access-backend/prisma
CMD [ "node", "main.js" ]
