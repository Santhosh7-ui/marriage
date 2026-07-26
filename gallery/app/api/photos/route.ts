import { AwsClient } from 'aws4fetch';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const aws = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  service: 's3',
  region: 'auto',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';

    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    const accountId = process.env.R2_ACCOUNT_ID;
    
    const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}`);
    url.searchParams.set('list-type', '2');
    if (prefix) {
      url.searchParams.set('prefix', prefix);
    }

    const response = await aws.fetch(url);
    if (!response.ok) throw new Error(await response.text());
    
    const text = await response.text();
    const contentsRegex = /<Contents>[\s\S]*?<Key>(.*?)<\/Key>[\s\S]*?<Size>(.*?)<\/Size>[\s\S]*?<\/Contents>/g;
    const allValidKeys: string[] = [];
    
    let match;
    while ((match = contentsRegex.exec(text)) !== null) {
      const key = match[1];
      const size = parseInt(match[2], 10);
      if (key && size > 0) {
        allValidKeys.push(key);
      }
    }

    let photos = [];

    if (prefix) {
      photos = allValidKeys.filter(key => key.startsWith(prefix)).sort();
    } else {
      const galleryKeys = allValidKeys.filter(key => 
        !key.includes('album/') && !key.includes('images/thumbnails/')
      );

      const favorites = galleryKeys.filter(key => key.startsWith('favorites/'));
      const regular = galleryKeys.filter(key => !key.startsWith('favorites/'));
      const favoriteFilenames = new Set(favorites.map(key => key.split('/').pop()));

      const deduplicatedRegular = regular.filter(key => {
        const filename = key.split('/').pop();
        return !favoriteFilenames.has(filename);
      });

      photos = [...favorites.sort(), ...deduplicatedRegular.sort()];
    }

    return NextResponse.json({ photos });
  } catch (e: unknown) {
    console.error('Error fetching photo list from R2:', e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return new NextResponse('Key is required', { status: 400 });

    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    const accountId = process.env.R2_ACCOUNT_ID;
    
    const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(key)}`);
    const response = await aws.fetch(url, { method: 'DELETE' });
    
    if (!response.ok) throw new Error(await response.text());

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (e: unknown) {
    console.error('Error deleting photo from R2:', e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, action } = await request.json();
    if (!key || action !== 'favorite') return new NextResponse('Invalid request', { status: 400 });

    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    const accountId = process.env.R2_ACCOUNT_ID;
    
    const filename = key.split('/').pop();
    const destinationKey = `favorites/${filename}`;

    const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(destinationKey)}`);
    const copySource = `/${bucketName}/${encodeURIComponent(key)}`;
    
    const response = await aws.fetch(url, {
      method: 'PUT',
      headers: {
        'x-amz-copy-source': copySource
      }
    });
    
    if (!response.ok) throw new Error(await response.text());

    return NextResponse.json({ success: true, message: 'Photo favorited successfully' });
  } catch (e: unknown) {
    console.error('Error favoriting photo in R2:', e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}
