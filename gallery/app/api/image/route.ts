import { AwsClient } from 'aws4fetch';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const aws = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  service: 's3',
  region: 'auto',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return new NextResponse('Missing key', { status: 400 });

  try {
    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    const accountId = process.env.R2_ACCOUNT_ID;
    const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(key)}`);
    
    const response = await aws.fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e: any) {
    console.error('Error fetching image from R2:', e);
    return new NextResponse(e.message, { status: 500 });
  }
}
