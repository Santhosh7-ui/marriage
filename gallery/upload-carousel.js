const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
});

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
  const folderPath = '/Users/santhoshsanthosh/Desktop/Carousel';
  
  if (!fs.existsSync(folderPath)) {
    console.error(`Folder not found: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
  
  console.log(`Uploading ${files.length} files to R2 bucket ${bucketName} under prefix "carousel/"...`);

  let uploaded = 0;
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      const fileStream = fs.createReadStream(filePath);
      const ext = path.extname(file).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.gif') contentType = 'image/gif';
      
      const key = `carousel/${file}`;
      
      try {
        await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileStream,
          ContentType: contentType,
        }));
        uploaded++;
        console.log(`Uploaded ${uploaded}/${files.length}: ${key}`);
      } catch (err) {
        console.error(`Failed to upload ${file}: ${err.message}`);
      }
    }
  }
  
  console.log('Upload complete.');
}

run().catch(console.error);
