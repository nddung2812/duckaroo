"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_STYLES = {
  New: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const STATUSES = ["New", "Processing", "Shipped", "Delivered", "Cancelled"];

function formatAddress(addr) {
  if (!addr || typeof addr !== "object") return "—";
  const parts = [addr.address, addr.suburb, addr.city, addr.state, addr.zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export default function OrdersTable({ orders, onStatusChange, onDelete }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
        No orders yet...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Items</TableHead>
            <TableHead className="hidden xl:table-cell">Shipping Address</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, i) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <TableRow key={order.id}>
                <TableCell className="text-gray-400 text-xs">{i + 1}</TableCell>
                <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                <TableCell className="font-medium">{order.customer_name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-gray-600">
                  {order.customer_email}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-sm text-gray-600 max-w-[250px] truncate" title={formatAddress(order.shipping_address)}>
                  {formatAddress(order.shipping_address)}
                </TableCell>
                <TableCell className="font-medium">
                  ${Number(order.total || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString("en-AU", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onDelete(order.id)}
                    className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
