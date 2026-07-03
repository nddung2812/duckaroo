// Shared helpers for customer-stories media (homepage + customer-stories page)

// Thumbnail/poster URL for a media item (videos fall back to their own URL)
export function getThumbUrl(media) {
  if (!media) return "";
  return media.type === "video" ? media.thumbnail || media.url : media.url;
}

// Cloudinary serves .mov far slower (and unevenly across browsers) than .mp4.
// Swapping the extension makes Cloudinary deliver an mp4 with the same transforms.
export function getVideoUrl(url) {
  if (!url) return url;
  return url.replace(/\.(mov|m4v|avi|wmv)$/i, ".mp4");
}
