import { unstable_cache } from 'next/cache';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchDiseaseImages(diseaseName) {
  try {
    const result = await cloudinary.search
      .expression(`folder="AquaticSwan/Aquarium Diseases/${diseaseName}"`)
      .max_results(100)
      .execute();

    if (result.resources && result.resources.length > 0) {
      return result.resources.map(resource => ({
        url: resource.secure_url,
        public_id: resource.public_id,
        width: resource.width,
        height: resource.height,
      }));
    }
    return [];
  } catch (error) {
    if (error?.error?.http_code === 420) {
      console.warn(`Cloudinary rate limit hit for "${diseaseName}" — returning empty`);
    } else {
      console.error(`Error fetching images for ${diseaseName}:`, error);
    }
    return [];
  }
}

export const getDiseaseImages = unstable_cache(
  fetchDiseaseImages,
  ['disease-images'],
  { revalidate: 3600 } // re-fetch from Cloudinary at most once per hour
);
