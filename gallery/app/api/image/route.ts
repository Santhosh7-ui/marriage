import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return new NextResponse('Missing key', { status: 400 });

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'wedding-photos',
      Key: key,
    });
    const response = await s3.send(command);
    
    // We can stream the response body directly using NextResponse
    return new NextResponse(response.Body as any, {
      headers: {
        'Content-Type': response.ContentType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e: any) {
    console.error('Error fetching image from R2:', e);
    return new NextResponse(e.message, { status: 500 });
  }
}
