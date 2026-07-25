import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.r2' });

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: 'wedding-photos', Prefix: 'favorites/' }));
    console.log((data.Contents || []).map(item => item.Key));
  } catch (err) {
    console.error(err);
  }
}
run();
