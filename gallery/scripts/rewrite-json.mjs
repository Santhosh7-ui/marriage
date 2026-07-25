import fs from 'fs';

const data = JSON.parse(fs.readFileSync('public/photos-normalized.json', 'utf8'));

const updated = data.map(photo => {
  // Extract key by removing the public URL prefix
  const thumbUrl = new URL(photo.thumbnail);
  const thumbKey = thumbUrl.pathname.replace(/^\//, ''); // e.g. images/thumbnails/...
  
  const galleryUrl = new URL(photo.gallery);
  const galleryKey = galleryUrl.pathname.replace(/^\//, '');

  return {
    ...photo,
    thumbnail: `/api/image?key=${thumbKey}`,
    gallery: `/api/image?key=${galleryKey}`,
  };
});

fs.writeFileSync('public/photos-normalized.json', JSON.stringify(updated, null, 2));
