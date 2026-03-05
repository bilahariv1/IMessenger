# MongoDB Setup for Heroku Deployment

This guide will help you set up MongoDB Atlas for your iMessenger backend application on Heroku.

## Local Development

### 1. Install MongoDB locally (optional)
- Download from https://www.mongodb.com/try/download/community
- Or use Docker: `docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo`

### 2. Set up .env file for local development
Create a `.env` file in the backend directory:

```bash
MONGODB_URI=mongodb://localhost:27017/imessenger
PORT=5000
```

### 3. Run the server locally
```bash
npm run dev
```

## Heroku Deployment with MongoDB Atlas

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for a free account
- Create a new project

### 2. Create a Cluster
- Click "Create" to build a new cluster
- Select **M0 Free Tier** (free, perfect for small projects)
- Choose your region (same as Heroku is recommended)
- Wait for cluster to be created (~3-5 minutes)

### 3. Create Database User
- In Atlas, go to "Database Access"
- Click "Add New Database User"
- Create username and password (save these securely)
- Give it Read and Write access to any database

### 4. Get Connection String
- Go to "Clusters" → your cluster → "Connect"
- Click "Drivers" 
- Copy the connection string, it should look like:
```
mongodb+srv://username:password@cluster0.mongodb.net/imessenger?retryWrites=true&w=majority
```

### 5. Deploy to Heroku
- Create/Login to Heroku: https://www.heroku.com
- Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
- In your project directory:

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variable
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.mongodb.net/imessenger?retryWrites=true&w=majority"

# Or set through Heroku Dashboard:
# Settings → Config Vars → Add MONGODB_URI

# Deploy
git push heroku main
```

### 6. Monitor your app
```bash
heroku logs --tail
```

## Important Notes

- **Free tier limits**: M0 free cluster has 512MB storage, shared resources
- **IP Whitelist**: In Atlas, add `0.0.0.0/0` to allow Heroku to connect
- **Never commit .env**: Keep credentials secure
- **Connection pooling**: Mongoose handles this automatically

## Troubleshooting

### Connection Timeout
- Check IP whitelist in Atlas Network Access
- Verify MONGODB_URI syntax is correct
- Check Heroku logs: `heroku logs --tail`

### Database not found
- MongoDB will create the database on first insert
- Check if data is being written to correct database name

### Out of storage
- M0 free tier has 512MB limit
- Upgrade to M2/M5 paid tiers if needed
