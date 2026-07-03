// Buyer-aware warnings keyed by product identity.
// Currently only Amazon Frogbit (Limnobium laevigatum) is flagged
// due to biosecurity restrictions in NSW, ACT and parts of QLD.

const AMAZON_FROGBIT_WARNING = {
  title: "Buyer Aware",
  shortMessage:
    "The sale and trade of frogbit is prohibited under NSW, ACT law and in some Queensland local government areas",
  fullMessage:
    "The sale and trade of frogbit is prohibited under NSW, ACT law and in some Queensland local government areas. You have a general biosecurity obligation to take reasonable and practical measures that are under your control to minimise the biosecurity risks associated with invasive plants.",
};

function matchesAmazonFrogbit(product) {
  if (!product) return false;
  const slug = (product.slug || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  return (
    slug.includes("amazon-frogbit") ||
    slug.includes("amazon_frogbit") ||
    name.includes("amazon frogbit")
  );
}

export function getBuyerAwareWarning(product) {
  if (matchesAmazonFrogbit(product)) return AMAZON_FROGBIT_WARNING;
  return null;
}
