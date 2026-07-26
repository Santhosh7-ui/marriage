import { AwsClient } from 'aws4fetch';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function getAwsClient(): AwsClient {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials (R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY) are not configured');
  }
  return new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' });
}

function getR2Config(): { bucketName: string; accountId: string } {
  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) throw new Error('R2_ACCOUNT_ID is not configured');
  const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
  return { bucketName, accountId };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const originalKey = searchParams.get('key');
  const isThumb = searchParams.get('thumb') === 'true';

  if (!originalKey) return new NextResponse('Missing key', { status: 400 });

  let key = originalKey;
  if (isThumb) {
    const filename = originalKey.split('/').pop();
    key = `images/thumbnails/${filename}`;
  }

  try {
    const aws = getAwsClient();
    const { bucketName, accountId } = getR2Config();

    const fetchFromR2 = async (targetKey: string) => {
      const url = new URL(
        `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(targetKey)}`,
      );
      return await aws.fetch(url);
    };

    let response = await fetchFromR2(key);

    // If thumbnail doesn't exist, gracefully fallback to the original image
    if (!response.ok && isThumb) {
      response = await fetchFromR2(originalKey);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e: unknown) {
    console.error('Error fetching image from R2:', e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}
