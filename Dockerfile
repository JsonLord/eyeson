
# Use a Node.js 18 base image
FROM node:18-alpine

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set the working directory
WORKDIR /app

# Copy all package.json files first to leverage Docker caching
COPY ux-analyst-ai/package.json ./ux-analyst-ai/package.json
COPY ux-analyst-ai/backend/package.json ./ux-analyst-ai/backend/package.json
COPY ux-analyst-ai/frontend/package.json ./ux-analyst-ai/frontend/package.json
COPY ux-analyst-ai/cli/package.json ./ux-analyst-ai/cli/package.json

# Install all dependencies
RUN cd ux-analyst-ai && npm install
RUN cd ux-analyst-ai/backend && npm install
RUN cd ux-analyst-ai/frontend && npm install
RUN cd ux-analyst-ai/cli && npm install

# Copy the rest of the application code
COPY ux-analyst-ai/ ./ux-analyst-ai/

# Build the frontend
RUN cd ux-analyst-ai/frontend && npm run build

# Create the data directory for screenshots
RUN mkdir -p ux-analyst-ai/data/screenshots

# Expose the application port
EXPOSE 7860

# Set the command to start the backend server on port 7860
CMD ["npm", "start", "--prefix", "ux-analyst-ai/backend"]
