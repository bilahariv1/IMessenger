# Use Node.js 18 Alpine for smaller image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy backend and frontend package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for backend
RUN npm install --prefix backend --omit=dev

# Install dependencies for frontend
RUN npm install --prefix frontend

# Copy entire application
COPY . .

# Build frontend for production
RUN npm run build --prefix frontend

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend server
CMD ["npm", "start", "--prefix", "backend"]
