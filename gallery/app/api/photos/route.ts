import { AwsClient } from 'aws4fetch';
import { XMLParser } from 'fast-xml-parser';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

/** Parse S3 ListObjectsV2 XML → array of { key, size } items */
function parseListResponse(xml: string): Array<{ key: string; size: number }> {
  const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });
  const result = parser.parse(xml);
  const contents = result?.ListBucketResult?.Contents;
  if (!contents) return [];
  const arr = Array.isArray(contents) ? contents : [contents];
  return arr
    .filter((c: Record<string, unknown>) => c.Key && Number(c.Size) > 0)
    .map((c: Record<string, unknown>) => ({ key: String(c.Key), size: Number(c.Size) }));
}

/** List all keys under a prefix, following ContinuationToken for >1000 objects */
async function listAllKeys(
  aws: AwsClient,
  baseUrl: URL,
  prefix?: string,
): Promise<string[]> {
  const allKeys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const url = new URL(baseUrl.toString());
    url.searchParams.set('list-type', '2');
    url.searchParams.set('max-keys', '1000');
    if (prefix) url.searchParams.set('prefix', prefix);
    if (continuationToken) url.searchParams.set('continuation-token', continuationToken);

    const response = await aws.fetch(url);
    if (!response.ok) throw new Error(await response.text());

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });
    const parsed = parser.parse(xml);
    const lr = parsed?.ListBucketResult;

    const items = parseListResponse(xml);
    allKeys.push(...items.map((i) => i.key));

    const isTruncated = lr?.IsTruncated === true || lr?.IsTruncated === 'true';
    continuationToken = isTruncated ? lr?.NextContinuationToken : undefined;
  } while (continuationToken);

  return allKeys;
}

// ─── GET /api/photos ─────────────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';

    const aws = getAwsClient();
    const { bucketName, accountId } = getR2Config();
    const baseUrl = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucketName}`);

    const allValidKeys = await listAllKeys(aws, baseUrl, prefix || undefined);

    let photos: string[];

    if (prefix) {
      photos = allValidKeys.filter((key) => key.startsWith(prefix)).sort();
    } else {
      const galleryKeys = allValidKeys.filter(
        (key) => !key.includes('album/') && !key.includes('images/thumbnails/'),
      );

      const favorites = galleryKeys.filter((key) => key.startsWith('favorites/'));
      const regular = galleryKeys.filter((key) => !key.startsWith('favorites/'));
      const favoriteFilenames = new Set(favorites.map((key) => key.split('/').pop()));

      const deduplicatedRegular = regular.filter((key) => {
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

// ─── DELETE /api/photos ───────────────────────────────────────────────────────

export async function DELETE(request: Request) {
  // Auth guard
  const cookieStore = await cookies();
  if (cookieStore.get('guest_auth')?.value !== 'true') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return new NextResponse('Key is required', { status: 400 });

    const aws = getAwsClient();
    const { bucketName, accountId } = getR2Config();

    const url = new URL(
      `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(key)}`,
    );
    const response = await aws.fetch(url, { method: 'DELETE' });

    if (!response.ok) throw new Error(await response.text());

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (e: unknown) {
    console.error('Error deleting photo from R2:', e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}

// ─── POST /api/photos ─────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Auth guard
  const cookieStore = await cookies();
  if (cookieStore.get('guest_auth')?.value !== 'true') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { key, action } = await request.json();
    if (!key || action !== 'favorite') {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const aws = getAwsClient();
    const { bucketName, accountId } = getR2Config();

    const filename = key.split('/').pop();
    const destinationKey = `favorites/${filename}`;

    const url = new URL(
      `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(destinationKey)}`,
    );
    const copySource = `/${bucketName}/${encodeURIComponent(key)}`;

    const response = await aws.fetch(url, {
      method: 'PUT',
      headers: { 'x-amz-copy-source': copySource },
    });

    if (!response.ok) throw new Error(await response.text());

    return NextResponse.json({ success: true, message: 'Photo favorited successfully' });
  } catch (e: unknown) {
    console.error('Error favoriting photo in R2:', e);
    return new NextResponse((e as Error).message, { status: 500 });
  }
}
