# =========================
# Build stage (Vite build)
# =========================
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# ---- Vite build-time environment variables ----
ARG VITE_RPC_URL
ARG VITE_FAUCET_ADDRESS
ARG VITE_TOKEN_ADDRESS

ENV VITE_RPC_URL=${VITE_RPC_URL}
ENV VITE_FAUCET_ADDRESS=${VITE_FAUCET_ADDRESS}
ENV VITE_TOKEN_ADDRESS=${VITE_TOKEN_ADDRESS}

# Build the frontend
RUN npm run build

# =========================
# Production stage (Nginx)
# =========================
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (for /health)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
