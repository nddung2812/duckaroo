"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatsCards from "./StatsCards";
import StockTable from "./StockTable";
import StockFormModal from "./StockFormModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import LeadsStats from "./LeadsStats";
import LeadsTable from "./LeadsTable";
import OrdersStats from "./OrdersStats";
import OrdersTable from "./OrdersTable";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "plants", label: "Plants" },
  { value: "livestock", label: "Livestock" },
  { value: "accessories", label: "Accessories" },
  { value: "probiotics", label: "Probiotics" },
];

export default function DashboardClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [modalItem, setModalItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [activeTab, setActiveTab] = useState("products");
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const hasFetchedLeads = useRef(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const hasFetchedOrders = useRef(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/stock");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData, editId) {
    try {
      const url = editId ? `/api/stock/${editId}` : "/api/stock";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }

      const { item } = await res.json();

      if (editId) {
        setItems((prev) => prev.map((i) => (i.id === editId ? item : i)));
        toast.success("Product updated");
      } else {
        setItems((prev) => [item, ...prev]);
        toast.success("Product added");
      }

      setModalItem(null);
    } catch (err) {
      toast.error(err.message ?? "Failed to save product");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteItem) return;
    try {
      // Delete all Cloudinary images for this product
      const images = Array.isArray(deleteItem.images) ? deleteItem.images : [];
      await Promise.all(
        images
          .filter((img) => img.public_id)
          .map((img) =>
            fetch("/api/stock/delete-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ publicId: img.public_id }),
            })
          )
      );

      const res = await fetch(`/api/stock/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteItem(null);
    }
  }

  async function fetchLeads() {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLeadsLoading(false);
    }
  }

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab === "leads" && !hasFetchedLeads.current) {
      hasFetchedLeads.current = true;
      fetchLeads();
    }
    if (tab === "orders" && !hasFetchedOrders.current) {
      hasFetchedOrders.current = true;
      fetchOrders();
    }
  }

  async function handleOrderStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update status");
        fetchOrders();
      }
    } catch {
      toast.error("Failed to update status");
      fetchOrders();
    }
  }

  async function handleOrderDelete(id) {
    if (!confirm("Delete this order?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete order");
        fetchOrders();
      }
    } catch {
      toast.error("Failed to delete order");
      fetchOrders();
    }
  }

  async function handleLeadStatusChange(id, status) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update status");
        fetchLeads();
      }
    } catch {
      toast.error("Failed to update status");
      fetchLeads();
    }
  }

  async function handleLeadDelete(id) {
    if (!confirm("Delete this lead?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete lead");
        fetchLeads();
      }
    } catch {
      toast.error("Failed to delete lead");
      fetchLeads();
    }
  }

  const [deployStatus, setDeployStatus] = useState("idle"); // idle | loading | success | error

  const handleRebuild = useCallback(async () => {
    setDeployStatus("loading");
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Deploy failed");
      }
      setDeployStatus("success");
      toast.success("Rebuild triggered");
    } catch (err) {
      setDeployStatus("error");
      toast.error(err.message ?? "Failed to trigger rebuild");
    } finally {
      setTimeout(() => setDeployStatus("idle"), 3000);
    }
  }, []);

  async function handleLogout() {
    await fetch("/api/dashboard/auth", { method: "DELETE" });
    window.location.href = "/dashboard/login";
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-semibold shrink-0">Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRebuild}
              disabled={deployStatus === "loading"}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                deployStatus === "success"
                  ? "bg-green-600 text-white"
                  : deployStatus === "error"
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={deployStatus === "loading" ? "animate-spin" : ""}
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              {deployStatus === "loading"
                ? "Rebuilding…"
                : deployStatus === "success"
                  ? "Triggered"
                  : deployStatus === "error"
                    ? "Failed"
                    : "Rebuild"}
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="Log out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:hidden"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          <button
            onClick={() => handleTabChange("products")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === "products"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => handleTabChange("leads")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === "leads"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Leads
          </button>
          <button
            onClick={() => handleTabChange("orders")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "products" ? (
          loading ? (
            <div className="text-center py-20 text-gray-500">Loading…</div>
          ) : (
            <>
              <StatsCards items={items} />

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setModalItem({})}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  + Add Product
                </button>
              </div>

              <StockTable
                items={filteredItems}
                onEdit={(item) => setModalItem(item)}
                onDelete={(item) => setDeleteItem(item)}
              />
            </>
          )
        ) : activeTab === "leads" ? (
          leadsLoading ? (
            <div className="text-center py-20 text-gray-500">Loading…</div>
          ) : (
            <>
              <LeadsStats leads={leads} />
              <LeadsTable leads={leads} onStatusChange={handleLeadStatusChange} onDelete={handleLeadDelete} />
            </>
          )
        ) : ordersLoading ? (
          <div className="text-center py-20 text-gray-500">Loading…</div>
        ) : (
          <>
            <OrdersStats orders={orders} />
            <OrdersTable orders={orders} onStatusChange={handleOrderStatusChange} onDelete={handleOrderDelete} />
          </>
        )}
      </main>

      {modalItem !== null && (
        <StockFormModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmDialog
        item={deleteItem}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
