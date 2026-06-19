# Deployment Guide

This guide outlines the steps to deploy the JCI Bangkok information site, built on Next.js 16, Payload CMS 3, and PostgreSQL.

---

## 1. Hosting Options

### Option A: Serverless (Vercel + Managed Postgres) - *Recommended for Cost & Scalability*
- **Frontend/Backend**: Vercel (Next.js serverless functions)
- **Database**: Neon (Serverless PostgreSQL) or Supabase
- **Media Storage**: AWS S3, Cloudflare R2, or Vercel Blob (essential since Vercel serverless has a read-only filesystem)

### Option B: Node.js Server (VPS / Docker / Render)
- **Server**: Render, Railway, fly.io, or VPS (Ubuntu/Docker)
- **Database**: Local or managed PostgreSQL
- **Media Storage**: Local storage (if persistent volume is attached) or S3-compatible storage

---

## 2. Environment Variables

Configure the following environment variables on your deployment platform:

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `DATABASE_URI` | Connection string to your PostgreSQL instance | `postgresql://user:pass@host:5432/db` |
| `PAYLOAD_SECRET` | Secure random string used for Payload authentication | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | Full public URL of the deployed application | `https://jcibangkok.org` |

### S3 Media Uploads (Required for Vercel/Serverless/Cloudflare R2)
When deploying on serverless architectures with read-only filesystems, Payload is configured to upload media directly to S3-compatible storage if the following variables are present:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `S3_BUCKET` | The name of your S3 bucket | `jci-bkk-media` |
| `S3_ACCESS_KEY_ID` | Your AWS or S3 provider access key | `your-access-key-id` |
| `S3_SECRET_ACCESS_KEY` | Your AWS or S3 provider secret key | `your-secret-access-key` |
| `S3_REGION` | The region of the bucket | `ap-southeast-1` |
| `S3_ENDPOINT` | *(Optional)* The endpoint URL if using R2/MinIO/DigitalOcean | `https://<account_id>.r2.cloudflarestorage.com` |

---

## 3. Step-by-Step Deployment (Vercel)

### Step 1: Database Setup
1. Create a serverless Postgres database on **Neon** or **Supabase**.
2. Copy the connection string (`DATABASE_URI`).

### Step 2: S3-Compatible Bucket Setup
1. Create a bucket (e.g., AWS S3 or Cloudflare R2).
2. Configure **CORS** on the bucket to allow GET/POST requests from your domain:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://jcibangkok.org", "http://localhost:3000"],
       "ExposeHeaders": []
     }
   ]
   ```
3. Generate Access/Secret keys for your bucket.

### Step 3: Vercel Project Configuration
1. Connect your repository to **Vercel**.
2. Add all environment variables listed in Section 2.
3. Deploy the project. Vercel will automatically compile the Next.js routes and compile Payload.

### Step 4: Run Seeding & Database Migration
To populate the production database with initial data (events, projects, articles, member stories):
1. Locate your deployment terminal or local terminal connected to the production database environment.
2. Run the seed script:
   ```bash
   DATABASE_URI="your-production-db-connection-string" npm run seed
   ```

---

## 4. Production Build Verification

Verify compile step locally before pushing:
```bash
npm run build
```
This performs static pre-rendering, type checking, and creates optimized JavaScript bundles.
