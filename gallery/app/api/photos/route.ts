import { S3Client, ListObjectsV2Command, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const dynamic = 'force-dynamic'; // Disable all caching

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
    
    // Filter out directories or empty keys
    const allValidKeys = (response.Contents || [])
      .filter(item => item.Key && item.Size && item.Size > 0)
      .map(item => item.Key as string);

    let photos = [];

    if (prefix) {
      // If fetching a specific album (like reception), just return those sorted
      photos = allValidKeys
        .filter(key => key.startsWith(prefix))
        .sort();
    } else {
      // If no prefix, it's the main gallery
      // 1. Remove album photos and thumbnail directory (they are handled differently)
      const galleryKeys = allValidKeys.filter(key => 
        !key.includes('album/') && !key.includes('images/thumbnails/')
      );

      // 2. Separate favorites from regular photos
      const favorites = galleryKeys.filter(key => key.startsWith('favorites/'));
      const regular = galleryKeys.filter(key => !key.startsWith('favorites/'));

      // 3. Extract the basenames (filenames) of the favorites to use for deduplication
      const favoriteFilenames = new Set(favorites.map(key => key.split('/').pop()));

      // 4. Filter regular photos: keep only those whose filename is NOT in the favorites set
      const deduplicatedRegular = regular.filter(key => {
        const filename = key.split('/').pop();
        return !favoriteFilenames.has(filename);
      });

      // 5. Combine them: favorites first, then the rest
      photos = [...favorites.sort(), ...deduplicatedRegular.sort()];
    }

    return NextResponse.json({ photos });
  } catch (e: any) {
    console.error('Error fetching photo list from R2:', e);
    return new NextResponse(e.message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return new NextResponse('Key is required', { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (e: any) {
    console.error('Error deleting photo from R2:', e);
    return new NextResponse(e.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, action } = await request.json();

    if (!key || action !== 'favorite') {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || 'wedding-photos';
    
    // Extract filename from the key (e.g. "gallery/photo1.jpg" -> "photo1.jpg")
    const filename = key.split('/').pop();
    const destinationKey = `favorites/${filename}`;

    const command = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${key}`, // Note: CopySource must be url-encoded if it contains spaces, but AWS SDK often handles it. Format is bucket/key.
      Key: destinationKey,
    });

    await s3.send(command);

    return NextResponse.json({ success: true, message: 'Photo favorited successfully' });
  } catch (e: any) {
    console.error('Error favoriting photo in R2:', e);
    return new NextResponse(e.message, { status: 500 });
  }
}

