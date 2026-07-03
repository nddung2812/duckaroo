"use client";

const LOW_STOCK_THRESHOLD = 5;

export default function StatsCards({ items }) {
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + Number(item.price) * Number(item.stock), 0);
  const lowStockCount = items.filter((item) => Number(item.stock) <= LOW_STOCK_THRESHOLD).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Total Products</p>
        <p className="text-3xl font-bold mt-1">{totalItems}</p>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Total Value</p>
        <p className="text-3xl font-bold mt-1">
          ${totalValue.toFixed(2)} <span className="text-base font-normal text-gray-400">AUD</span>
        </p>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Low Stock Alerts</p>
        <p className={`text-3xl font-bold mt-1 ${lowStockCount > 0 ? "text-amber-500" : "text-green-600"}`}>
          {lowStockCount}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">stock ≤ {LOW_STOCK_THRESHOLD}</p>
      </div>
    </div>
  );
}
