import Link from "next/link";

/** Tinted to sit on the site's dark glass rather than the dashboard's white. */
const STATUS_STYLES = {
  New: "bg-cream/10 text-cream/80 border-cream/20",
  Processing: "bg-amber-glow/15 text-amber-glow border-amber-glow/30",
  Shipped: "bg-amber-glow/15 text-amber-glow border-amber-glow/30",
  Delivered: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  Cancelled: "bg-red-400/10 text-red-300 border-red-400/25",
};

const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * The customer's past orders. Rendered on the server from the session's email —
 * see getOrdersForEmail() for why the match is on email and not a user id.
 */
export default function OrderHistory({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="mt-6 bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl p-8 text-center">
        <p className="text-cream/70 text-sm">No orders yet.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-amber-glow font-medium hover:text-amber-glow/80 underline underline-offset-4 transition-colors"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {orders.map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.New;

        return (
          <article
            key={order.id}
            className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl shadow-2xl p-6"
          >
            <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-4 border-b border-cream/10">
              <div>
                <p className="font-mono text-sm text-cream">{order.order_number}</p>
                <p className="mt-0.5 text-xs text-cream/50">{formatDate(order.created_at)}</p>
              </div>
              {order.status && (
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${statusStyle}`}
                >
                  {order.status}
                </span>
              )}
            </header>

            {items.length > 0 && (
              <ul className="py-4 space-y-2 text-sm">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span className="text-cream/80">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-cream/50"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="text-cream/70 whitespace-nowrap tabular-nums">
                      {money.format(Number(item.price ?? 0) * Number(item.quantity ?? 1))}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <footer className="flex justify-between gap-4 pt-4 border-t border-cream/10 text-sm">
              <span className="text-cream/60">
                Total
                {Number(order.shipping) > 0 && (
                  <span className="text-cream/40"> · incl. {money.format(Number(order.shipping))} shipping</span>
                )}
              </span>
              <span className="text-cream font-medium tabular-nums">
                {money.format(Number(order.total ?? 0))}
              </span>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
