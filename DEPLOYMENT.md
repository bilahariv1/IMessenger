# Deployment Guide

This guide covers deploying the IMessenger application to production.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (for cloud database)
- Meta/Facebook Developer account (for WhatsApp API)
- Git repository (GitHub/GitLab/Bitbucket)

## Deployment Platforms

### Option 1: Heroku Deployment

#### Setup

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set WHATSAPP_ACCESS_TOKEN=your_access_token
   heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   heroku config:set WHATSAPP_API_VERSION=v22.0
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install --prefix backend
RUN npm install --prefix frontend

# Copy application code
COPY . .

# Build frontend
RUN npm run build --prefix frontend

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
```

#### Build and Run

```bash
# Build image
docker build -t imessenger:latest .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e WHATSAPP_ACCESS_TOKEN=your_token \
  -e WHATSAPP_PHONE_NUMBER_ID=your_id \
  imessenger:latest
```

---

### Option 3: Traditional VPS (AWS EC2, DigitalOcean, Linode)

#### Setup Steps

1. **SSH into your server**
   ```bash
   ssh ubuntu@your_server_ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MongoDB (or use MongoDB Atlas)**
   ```bash
   # For local MongoDB
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas (recommended)
   ```

4. **Clone Repository**
   ```bash
   git clone your_repo_url
   cd imessenger
   ```

5. **Install Dependencies**
   ```bash
   npm run install:all
   ```

6. **Create .env file**
   ```bash
   cp backend/.env.production backend/.env
   # Edit with your production values
   nano backend/.env
   ```

7. **Build Frontend**
   ```bash
   npm run build --prefix frontend
   ```

8. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

9. **Start Application**
   ```bash
   pm2 start backend/app.js --name "imessenger"
   pm2 save
   pm2 startup
   ```

10. **Setup Nginx (Reverse Proxy)**
    ```bash
    sudo apt-get install -y nginx
    ```
    
    Create `/etc/nginx/sites-available/imessenger`:
    ```nginx
    server {
        listen 80;
        server_name your_domain.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    
    Enable site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/imessenger /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Setup SSL with Let's Encrypt**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your_domain.com
    ```

---

## Production Checklist

- [ ] MongoDB is set up and connection string verified
- [ ] WhatsApp API token is valid and not expired
- [ ] WhatsApp Phone Number ID is correct
- [ ] Environment variables are set correctly
- [ ] Frontend build is created: `npm run build --prefix frontend`
- [ ] Node environment is set to `production`
- [ ] SSL certificate is installed
- [ ] CORS is configured properly
- [ ] Database backups are configured
- [ ] Logging is set up
- [ ] Monitoring is configured (e.g., PM2 Plus, DataDog)

---

## Environment Variables

### Required Variables

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/imessenger

# Server
PORT=5000
NODE_ENV=production

# WhatsApp API
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_API_VERSION=v22.0
```

---

## Monitoring & Logs

### PM2 Monitoring
```bash
# View logs
pm2 logs imessenger

# Monitor process
pm2 monit

# View details
pm2 show imessenger
```

### Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

---

## Updates & Rollback

### Deploy Updates
```bash
git pull origin main
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix frontend
pm2 restart imessenger
```

### Rollback
```bash
git revert HEAD
git push origin main
# Restart application and redeploy
```

---

## Database Backup

### MongoDB Atlas (Recommended)
- Automated backups are enabled by default
- Configure backup retention period in console
- Download backups from Atlas Dashboard

### Manual Backup
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/imessenger" --out=./backup
```

---

## Troubleshooting

### Application won't start
```bash
pm2 logs imessenger
# Check for missing environment variables
# Check MongoDB connection
# Check port availability
```

### WhatsApp messages not sending
- Verify access token hasn't expired
- Check phone number ID is correct
- Ensure recipient is added as test number
- Check WhatsApp API rate limits

### High Memory Usage
```bash
pm2 kill
pm2 start backend/app.js --max-memory-restart 500M --name "imessenger"
```

---

## Support

For issues, check:
1. Application logs: `pm2 logs imessenger`
2. MongoDB connection status
3. Firewall/Security group rules
4. WhatsApp API status
5. Environment variables
