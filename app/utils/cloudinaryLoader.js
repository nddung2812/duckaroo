const MAX_WIDTH = 1200;

export default function cloudinaryLoader({ src, width }) {
  // For non-Cloudinary URLs (Wikimedia, Unsplash, etc.), return as-is
  // These are served unoptimized via next/image unoptimized prop
  if (!src || !src.includes('res.cloudinary.com')) {
    return src;
  }

  const cappedWidth = Math.min(width, MAX_WIDTH);
  const uploadIndex = src.indexOf('/upload/');
  if (uploadIndex === -1) return src;

  const beforeUpload = src.slice(0, uploadIndex + '/upload/'.length);
  const afterUpload = src.slice(uploadIndex + '/upload/'.length);

  // Detect if there's a transform block (vs bare v{version}/... URL)
  const hasTransformBlock = !/^v\d+\//.test(afterUpload);

  let existingTransforms = '';
  let remainder = '';

  if (hasTransformBlock) {
    const versionMatch = afterUpload.match(/\/(v\d+\/)/);
    if (versionMatch) {
      const splitIndex = afterUpload.indexOf(versionMatch[0]);
      existingTransforms = afterUpload.slice(0, splitIndex);
      remainder = afterUpload.slice(splitIndex + 1);
    } else {
      remainder = afterUpload;
    }
  } else {
    remainder = afterUpload;
  }

  let parts = existingTransforms
    ? existingTransforms.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  // Remove w_ and q_ (we control these)
  parts = parts.filter(t => !t.startsWith('w_') && !t.startsWith('q_'));
  // Ensure f_auto
  if (!parts.includes('f_auto')) parts.unshift('f_auto');
  // Insert q_auto after f_auto
  const fIdx = parts.indexOf('f_auto');
  parts.splice(fIdx + 1, 0, 'q_auto');
  // Append our width
  parts.push(`w_${cappedWidth}`);

  return `${beforeUpload}${parts.join(',')}/${remainder}`;
}
