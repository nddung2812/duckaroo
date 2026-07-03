"use client";

export default function LeadsStats({ leads }) {
  const total = leads.length;
  const newCount = leads.filter((l) => l.status === "New").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">Total Leads</p>
        <p className="text-3xl font-bold mt-1">{total}</p>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">New Leads</p>
        <p className={`text-3xl font-bold mt-1 ${newCount > 0 ? "text-blue-600" : ""}`}>
          {newCount}
        </p>
      </div>
    </div>
  );
}
