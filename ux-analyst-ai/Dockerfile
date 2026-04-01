FROM node:20

# Install system dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set environment variables
ENV PORT=7860
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy root package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build the frontend
COPY frontend ./frontend
RUN cd frontend && npm install --include=dev && npm run build

# Copy backend package files and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend ./backend

# Create data directories
RUN mkdir -p data/screenshots logs

# Set proper permissions
RUN chown -R node:node /app
USER node

# Expose port (mandatory for HF Spaces)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:7860/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
