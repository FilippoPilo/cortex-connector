# Cortex connector, stdio MCP bridge to the hosted Cortex memory service.
# Build:  docker build -t cortex-connector .
# Run:    docker run -i --rm -e CORTEX_ACCESS_TOKEN=... cortex-connector
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server ./server
USER node
ENTRYPOINT ["node", "server/index.js"]
