# ---------- build stage ----------
FROM node:20-slim AS build
WORKDIR /app

# Tools needed to compile native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# VERY IMPORTANT: force native build inside the container
ENV npm_config_build_from_source=true

# only package files for dependency install
COPY package*.json ./

# clean install + rebuild better-sqlite3 from source (linux)
RUN npm ci && npm rebuild better-sqlite3 --build-from-source

# now copy the rest of the app (no node_modules from host because .dockerignore)
COPY . .

# ---------- runtime stage ----------
FROM node:20-slim
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
