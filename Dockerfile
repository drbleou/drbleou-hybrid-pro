# Build front
FROM node:20-bullseye AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend ./
RUN npm run build

# Final image
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY backend /app/backend
COPY --from=frontend-build /frontend/dist /app/frontend/dist
ENV PORT=8080
EXPOSE 8080
CMD ["uvicorn","backend.app.main:app","--host","0.0.0.0","--port","8080"]
