# ----- Frontend build -----
FROM node:18-alpine AS frontend
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

ARG VITE_API_URL
ARG VITE_CLOUD_NAME
ARG VITE_CLOUD_UPLOAD_PRESET

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLOUD_NAME=$VITE_CLOUD_NAME
ENV VITE_CLOUD_UPLOAD_PRESET=$VITE_CLOUD_UPLOAD_PRESET

RUN npm run build

# ----- Backend build -----
FROM node:18-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend .

COPY --from=frontend /frontend/dist ./public

EXPOSE 3000
CMD ["npm", "start"] 