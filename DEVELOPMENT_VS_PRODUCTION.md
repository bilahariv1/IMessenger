# iMessenger - Development vs Production Setup

This project is configured to run in two modes:

## **1. Development (Local)**

### Setup
1. Use the default `.env` file (local MongoDB):
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/imessenger
   PORT=5000
   NODE_ENV=development
   ```

2. Ensure MongoDB is running locally:
   ```powershell
   Get-Service MongoDB  # Check if running
   ```

3. Seed initial data:
   ```bash
   npm run seed
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```

5. In another terminal, start the frontend:
   ```bash
   cd ../frontend
   npm start
   ```

6. Open `http://localhost:3000`

---

## **2. Production (Heroku)**

### Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (free tier)

### Step 1: Create MongoDB Atlas Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create a database user
4. Get the connection string:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/imessenger?retryWrites=true&w=majority
   ```

### Step 2: Prepare for Deployment
1. Make sure you have a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Ensure `.env` file is in `.gitignore` (already configured)

### Step 3: Deploy to Heroku
1. Login to Heroku:
   ```bash
   heroku login
   ```

2. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.mongodb.net/imessenger?retryWrites=true&w=majority"
   heroku config:set NODE_ENV=production
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

5. Seed the production database:
   ```bash
   heroku run "npm run seed"
   ```

6. View logs:
   ```bash
   heroku logs --tail
   ```

7. Open your app:
   ```bash
   heroku open
   ```

---

## **Key Differences**

| Aspect | Development | Production |
|--------|-------------|-----------|
| Database | Local MongoDB | MongoDB Atlas (Cloud) |
| Connection | `127.0.0.1:27017` | `mongodb+srv://...` |
| Config File | `.env` (local) | Heroku config vars |
| Process | `npm run dev` | `npm start` (Procfile) |
| Restart | Manual | Automatic (Heroku dyno) |
| Logs | Console output | `heroku logs --tail` |

---

## **File Structure**

```
backend/
├── .env                    # Local development (gitignored)
├── .env.development        # Template for development
├── .env.production.example # Template for production
├── Procfile                # Heroku process definition
├── package.json
├── app.js
├── config/
│   └── db.js              # Uses process.env.MONGODB_URI
├── models/
├── controllers/
├── routes/
└── services/
```

---

## **Troubleshooting**

### Local Connection Issues
- MongoDB not running: `Start-Service MongoDB`
- IPv6 problem: Use `127.0.0.1` instead of `localhost`

### Heroku Deployment Issues
- Check logs: `heroku logs --tail`
- Verify env vars: `heroku config`
- Check Atlas IP whitelist: Allow `0.0.0.0/0`

### Database Issues
- View collections: Use MongoDB Compass
- Clear data: `db.messages.deleteMany({})`

---

## **Environment Variables Reference**

### Development (.env)
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/imessenger
PORT=5000
NODE_ENV=development
```

### Production (Heroku Config Vars)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/imessenger?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

---

**Ready to deploy?** Run `npm run build && git push heroku main` 🚀
