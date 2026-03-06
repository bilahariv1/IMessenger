#!/bin/bash

# IMessenger Production Deployment Script
# This script prepares the application for production deployment

echo "================================"
echo "IMessenger Production Setup"
echo "================================"

# Check Node.js version
echo ""
echo "Checking Node.js version..."
node_version=$(node -v)
echo "Node.js version: $node_version"

# Check npm version
echo ""
echo "Checking npm version..."
npm_version=$(npm -v)
echo "npm version: $npm_version"

# Install dependencies
echo ""
echo "Installing backend dependencies..."
npm install --prefix backend

echo ""
echo "Installing frontend dependencies..."
npm install --prefix frontend

# Build frontend
echo ""
echo "Building frontend for production..."
npm run build --prefix frontend

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Check for .env file
echo ""
echo "Checking environment configuration..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found in backend/"
    echo "Creating .env from .env.production template..."
    cp backend/.env.production backend/.env
    echo "⚠️  Please edit backend/.env with your production values"
else
    echo "✅ .env file exists"
fi

# Verify required environment variables
echo ""
echo "Verifying required environment variables..."
required_vars=("MONGODB_URI" "WHATSAPP_ACCESS_TOKEN" "WHATSAPP_PHONE_NUMBER_ID" "WHATSAPP_API_VERSION")

missing_vars=()
for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" backend/.env; then
        echo "✅ $var is set"
    else
        echo "❌ $var is NOT set"
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing environment variables: ${missing_vars[@]}"
    exit 1
fi

echo ""
echo "================================"
echo "✅ Production setup complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Verify all environment variables in backend/.env"
echo "2. Test the application locally: npm start --prefix backend"
echo "3. Choose a deployment platform:"
echo "   - Heroku: git push heroku main"
echo "   - Docker: docker-compose up -d"
echo "   - VPS: Use PM2 to start the app"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
echo ""
