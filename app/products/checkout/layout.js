// Checkout is a client component and can't export metadata itself. Without
// this layout it inherits index:true and the /products canonical from
// app/products/layout.js. The empty `alternates` replaces the inherited
// canonical (Next.js does not deep-merge metadata objects).
export const metadata = {
  title: "Checkout | Duckaroo",
  robots: { index: false, follow: false },
  alternates: {},
};

export default function CheckoutLayout({ children }) {
  return children;
}
