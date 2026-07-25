import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';

    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix ? prefix : undefined,
    });

    const response = await s3.send(command);
    
    // Filter out directories or empty keys if any, and return only the keys
    const photos = (response.Contents || [])
      .filter(item => item.Key && item.Size && item.Size > 0)
      .map(item => item.Key)
      // Remove any keys that belong to a different sub-folder if no prefix is given (optional, but let's just use prefix)
      .filter(key => prefix ? key?.startsWith(prefix) : !key?.includes('album/'))
      .sort();

    return NextResponse.json({ photos });
  } catch (e: any) {
    console.error('Error fetching photo list from R2:', e);
    return new NextResponse(e.message, { status: 500 });
  }
}
