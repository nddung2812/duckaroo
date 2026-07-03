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
  Contacted: "bg-green-100 text-green-800",
  "Not Contacted": "bg-orange-100 text-orange-800",
  Closed: "bg-gray-100 text-gray-600",
};

const STATUSES = ["New", "Contacted", "Not Contacted", "Closed"];

export default function LeadsTable({ leads, onStatusChange, onDelete }) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
        No leads yet…
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="hidden md:table-cell">Source</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, i) => (
            <TableRow key={lead.id}>
              <TableCell className="text-gray-400 text-xs">{i + 1}</TableCell>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell className="hidden md:table-cell text-sm text-gray-600">{lead.email}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-gray-600">{lead.phone}</TableCell>
              <TableCell className="text-sm">{lead.service}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{lead.source}</span>
              </TableCell>
              <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                {new Date(lead.created_at).toLocaleDateString("en-AU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onDelete(lead.id)}
                  className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
