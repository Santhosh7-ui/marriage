import { S3Client, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://5af3adc7b2a2280d1f8b8bdd414bb631.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: 'ecc33412b00834aa199bf1d6ef4ca5ee',
    secretAccessKey: '00dbdb298ca0627893fbafd911b8e6e98b419d36b09b00da612c67255e4ab87d',
  },
});
s3.send(new ListObjectsV2Command({ Bucket: 'wedding-photos', MaxKeys: 5 }))
  .then(data => console.log('Found:', data.Contents.map(c => c.Key)))
  .catch(err => console.error('Error:', err.message));
