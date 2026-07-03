"use client";

export default function OrdersStats({ orders }) {
  const total = orders.length;
  const newCount = orders.filter((o) => o.status === "New").length;
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Total Orders</p>
        <p className="text-3xl font-bold mt-1">{total}</p>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">New Orders</p>
        <p className={`text-3xl font-bold mt-1 ${newCount > 0 ? "text-blue-600" : ""}`}>
          {newCount}
        </p>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Total Revenue</p>
        <p className="text-3xl font-bold mt-1 text-green-600">
          ${revenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
