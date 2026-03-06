# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All tests pass locally
- [ ] No console.log statements left in production code
- [ ] No hardcoded secrets or API keys
- [ ] ESLint errors resolved
- [ ] Frontend builds without warnings: `npm run build --prefix frontend`

### Environment Setup
- [ ] Production MongoDB instance is ready
  - [ ] Database backups are configured
  - [ ] Network access is restricted appropriately
- [ ] WhatsApp API credentials are valid
  - [ ] Access token is not expired
  - [ ] Phone number ID is correct
  - [ ] API version is compatible
- [ ] Environment variables are prepared in `.env.production`

### Security
- [ ] All environment variables are added to deployment platform
- [ ] CORS is properly configured for production domain
- [ ] MongoDB connection uses strong password
- [ ] SSL/TLS certificate is ready
- [ ] Firebase/Auth tokens are production-ready

### Database
- [ ] Database schema is finalized
- [ ] Indexes are created for performance
- [ ] Initial data seed is prepared
- [ ] Backup strategy is documented

---

## Deployment Steps

Choose one of the deployment options:

### Option 1: Heroku (Simplest)

```bash
# 1. Set environment variables
heroku config:set MONGODB_URI=your_uri
heroku config:set WHATSAPP_ACCESS_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_id
heroku config:set NODE_ENV=production

# 2. Deploy
git push heroku main

# 3. Monitor
heroku logs --tail
```

### Option 2: Docker + Docker Compose (Local)

```bash
# 1. Create .env file from .env.production
cp backend/.env.production backend/.env
# Edit with actual production values

# 2. Run with Docker Compose
docker-compose up -d

# 3. Check logs
docker-compose logs -f app
```

### Option 3: VPS Deployment

```bash
# 1. Build frontend
npm run build --prefix frontend

# 2. Set environment
export NODE_ENV=production
cp backend/.env.production backend/.env

# 3. Start with PM2
pm2 start backend/app.js --name "imessenger"
pm2 save
pm2 startup

# 4. Setup Nginx reverse proxy
sudo systemctl restart nginx
```

---

## Post-Deployment

### Verification
- [ ] Website loads at production URL
- [ ] All pages are accessible
- [ ] WhatsApp API connectivity is working
- [ ] Database operations are successful
- [ ] Frontend is served from production build
- [ ] API endpoints respond correctly

### Monitoring Setup
- [ ] Application logs are being captured
- [ ] Error tracking is configured (Sentry, etc.)
- [ ] Performance monitoring is enabled
- [ ] Automated backups are running

### Testing
- [ ] Send test WhatsApp message
- [ ] Test message reply functionality
- [ ] Test template message sending
- [ ] Verify data persistence in database
- [ ] Test error handling scenarios

---

## Production Environment Variables

Required variables in production:

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/imessenger

# Server
NODE_ENV=production
PORT=5000

# WhatsApp
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_API_VERSION=v22.0
```

---

## Rollback Plan

If deployment fails:

```bash
# 1. Identify the issue
# - Check logs
# - Verify environment variables
# - Test API endpoints

# 2. Rollback to previous version
git revert HEAD
git push origin main
# Redeploy

# 3. Restore database if needed
# Use MongoDB backup
```

---

## Maintenance

### Daily
- Monitor error logs for critical issues
- Check WhatsApp API rate limits

### Weekly
- Review application logs for patterns
- Check database disk space

### Monthly
- Test backup/restore process
- Review performance metrics
- Update dependencies (security patches)

### Quarterly
- Full security audit
- Load testing
- Disaster recovery drill

---

## Support Contacts

- **Database Issues:** MongoDB Atlas support
- **WhatsApp Issues:** Meta Business support
- **Hosting Issues:** Heroku/VPS provider support
- **SSL Issues:** Let's Encrypt / SSL provider

---

## Quick Links

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Meta WhatsApp API](https://developers.facebook.com/docs/whatsapp)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## Success Criteria

✅ Application is accessible at production URL  
✅ All API endpoints are working  
✅ WhatsApp messages are being sent and received  
✅ Database is stable and backed up  
✅ No errors in application logs  
✅ Average response time < 500ms  
✅ Uptime > 99%  
