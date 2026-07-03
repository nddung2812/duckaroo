"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LOW_STOCK_THRESHOLD = 5;

const CATEGORY_LABELS = {
  plants: "Plants",
  livestock: "Livestock",
  accessories: "Accessories",
  probiotics: "Probiotics",
};

export default function StockTable({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
        No products found. Add your first product.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isLowStock = Number(item.stock) <= LOW_STOCK_THRESHOLD;
            const firstImage = Array.isArray(item.images) ? item.images[0] : null;
            return (
              <TableRow key={item.id} className={isLowStock ? "bg-amber-50" : ""}>
                <TableCell>
                  {firstImage?.url ? (
                    <div className="relative w-10 h-10">
                      <Image
                        src={firstImage.url}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                      —
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden md:table-cell text-gray-400 text-xs font-mono">
                  {item.slug}
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                </TableCell>
                <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <span className={isLowStock ? "text-amber-600 font-semibold" : ""}>
                    {item.stock}
                    {isLowStock && <span className="ml-1 text-xs">⚠</span>}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-xs px-2 py-1 border rounded hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="text-xs px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
