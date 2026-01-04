# 🚀 DEPLOYMENT GUIDE - imuii.id

## Step-by-Step Deployment

### 1. Prepare Project
- [x] Next.js project generated
- [x] All files copied
- [x] Configuration complete

### 2. Upload to imuii.id
1. Login to imuii.id dashboard
2. Create new project
3. Select "Next.js" as framework
4. Upload project folder (or connect GitHub)

### 3. Set Environment Variables
In imuii.id dashboard, add:

```
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Build Settings
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Node Version:** 18.x or higher

### 5. Deploy
Click "Deploy" button and wait for build to complete.

### 6. Verify
After deployment:
- [ ] Landing page loads
- [ ] Login works
- [ ] Register works with progress steps
- [ ] Google Sign-In works
- [ ] Dashboard displays after login
- [ ] All pages accessible
- [ ] All JavaScript functions work
- [ ] Supabase integration works

## Troubleshooting

### Issue: White screen
- Check browser console for errors
- Verify all environment variables set
- Check Network tab for failed requests

### Issue: Scripts not loading
- Verify files in `/public/` folder
- Check Content-Security-Policy headers

### Issue: Supabase errors
- Verify Supabase URL and keys
- Check Supabase dashboard for API status

## Support
For issues, check:
- Browser console (F12)
- Next.js build logs
- imuii.id deployment logs
