"use client";

import { useState, useTransition, useMemo } from "react";
import clsx from "clsx";
import { Search, Download, Trash2, Archive, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { TrialLead, ClassStyle } from "@/lib/types";
import { updateLeadStatus, deleteLead } from "@/app/admin/(dashboard)/leads/actions";

const inputClass =
  "border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none placeholder:text-ink-faint rounded transition-colors";

const selectClass =
  "border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none rounded transition-colors cursor-pointer";

const getStatusStyles = (status: TrialLead["status"]) => {
  switch (status) {
    case "new":
      return "bg-red-500/15 text-red-500 border-red-500/30";
    case "contacted":
      return "bg-yellow-500/15 text-yellow-500 border-yellow-500/30";
    case "trial_booked":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "joined":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "rejected":
      return "bg-neutral-500/15 text-neutral-400 border-neutral-500/30";
    case "archived":
      return "bg-white/5 text-ink-muted border-white/10";
    default:
      return "bg-white/5 text-ink border-white/10";
  }
};

interface LeadsTableProps {
  leads: TrialLead[];
  classStyles: ClassStyle[];
}

export function LeadsTable({ leads, classStyles }: LeadsTableProps) {
  const [pending, startTransition] = useTransition();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter & Sort Logic
  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter((lead) => {
      // 1. Status Filter (default: exclude archived unless statusFilter is "archived" or "all-statuses")
      if (statusFilter === "all") {
        if (lead.status === "archived") return false;
      } else if (statusFilter !== "all-statuses") {
        if (lead.status !== statusFilter) return false;
      }

      // 2. Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const nameMatch = lead.fullName.toLowerCase().includes(query);
        const phoneMatch = lead.phone.toLowerCase().includes(query);
        const emailMatch = lead.email.toLowerCase().includes(query);
        if (!nameMatch && !phoneMatch && !emailMatch) return false;
      }

      // 3. Class Filter
      if (classFilter !== "all" && lead.classInterest !== classFilter) {
        return false;
      }

      // 4. Date Filter
      const createdDate = new Date(lead.createdAt);
      const now = new Date();

      if (dateFilter === "today") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (createdDate < today) return false;
      } else if (dateFilter === "yesterday") {
        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (createdDate < yesterdayStart || createdDate >= yesterdayEnd) return false;
      } else if (dateFilter === "7days") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (createdDate < sevenDaysAgo) return false;
      } else if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (createdDate < thirtyDaysAgo) return false;
      } else if (dateFilter === "month") {
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        if (createdDate < thisMonthStart) return false;
      } else if (dateFilter === "custom") {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (createdDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (createdDate > end) return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "name-asc") {
        return a.fullName.localeCompare(b.fullName);
      } else if (sortBy === "name-desc") {
        return b.fullName.localeCompare(a.fullName);
      }
      return 0;
    });
  }, [leads, search, statusFilter, classFilter, dateFilter, startDate, endDate, sortBy]);

  // Paginated leads
  const totalCount = filteredAndSortedLeads.length;
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const paginatedLeads = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedLeads.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredAndSortedLeads, currentPage, rowsPerPage]);

  const handleStatusChange = (id: string, newStatus: TrialLead["status"]) => {
    startTransition(async () => {
      const res = await updateLeadStatus(id, newStatus);
      if (!res.success) {
        alert(res.error ?? "Failed to update status.");
      }
    });
  };

  const handleArchive = (id: string) => {
    startTransition(async () => {
      const res = await updateLeadStatus(id, "archived");
      if (!res.success) {
        alert(res.error ?? "Failed to archive lead.");
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const res = await deleteLead(deleteId);
      if (res.success) {
        setDeleteId(null);
      } else {
        alert(res.error ?? "Failed to delete lead.");
      }
    });
  };

  // EXPORT UTILITIES

  const handleExportCSV = () => {
    const headers = ["Name", "Phone", "Email", "Interested Class", "Age Group", "Preferred Days", "Status", "Received Date", "Message"];
    const rows = filteredAndSortedLeads.map((lead) => [
      lead.fullName,
      lead.phone,
      lead.email,
      lead.classInterest,
      lead.ageGroup,
      lead.preferredDays.join(", "),
      lead.status,
      new Date(lead.createdAt).toLocaleString(),
      lead.message ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trial_leads_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    let table = `<table border="1">
      <thead>
        <tr style="background-color: #1a1a1a; color: #ffffff; font-weight: bold;">
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Interested Class</th>
          <th>Age Group</th>
          <th>Preferred Days</th>
          <th>Status</th>
          <th>Received Date</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>`;

    filteredAndSortedLeads.forEach((lead) => {
      table += `<tr>
        <td>${lead.fullName}</td>
        <td>${lead.phone}</td>
        <td>${lead.email}</td>
        <td>${lead.classInterest}</td>
        <td>${lead.ageGroup}</td>
        <td>${lead.preferredDays.join(", ")}</td>
        <td>${lead.status}</td>
        <td>${new Date(lead.createdAt).toLocaleString()}</td>
        <td>${lead.message ?? ""}</td>
      </tr>`;
    });

    table += `</tbody></table>`;

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Leads</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body style="background-color: #ffffff; font-family: sans-serif;">${table}</body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trial_leads_export_${new Date().toISOString().split("T")[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset pagination on filter change
  const handleFilterChange = (setter: (v: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20 py-10 px-4 text-center rounded">
        <p className="text-sm font-semibold text-ink-muted">No trial bookings have been submitted yet.</p>
        <p className="text-xs text-ink-faint mt-1">New registrations from the Contact page form will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* CRM Actions & Filters Panel */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search and Export Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className={clsx(inputClass, "w-full pl-9")}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              disabled={totalCount === 0}
              className="btn border border-white/10 hover:border-accent text-xs flex items-center gap-1.5 py-2 px-3 rounded text-ink-muted hover:text-accent disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-ink-muted"
              title="Export CSV"
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={handleExportExcel}
              disabled={totalCount === 0}
              className="btn border border-white/10 hover:border-accent text-xs flex items-center gap-1.5 py-2 px-3 rounded text-ink-muted hover:text-accent disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-ink-muted"
              title="Export Excel"
            >
              <Download size={14} /> Excel
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Status filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">Active Leads (Excl. Archived)</option>
              <option value="all-statuses">All Leads (Incl. Archived)</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="trial_booked">Trial Booked</option>
              <option value="joined">Joined</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Class filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Interested Class</label>
            <select
              value={classFilter}
              onChange={(e) => handleFilterChange(setClassFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Classes</option>
              {classStyles.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Date Received</label>
            <select
              value={dateFilter}
              onChange={(e) => handleFilterChange(setDateFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range...</option>
            </select>
          </div>

          {/* Sort filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={selectClass}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Custom Date Inputs */}
        {dateFilter === "custom" && (
          <div className="flex flex-wrap gap-3 p-3 bg-black/20 border border-white/5 rounded items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
                className={clsx(inputClass, "!py-1 !px-2 text-xs")}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
                className={clsx(inputClass, "!py-1 !px-2 text-xs")}
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className="text-xs text-accent hover:underline flex items-center gap-1 ml-auto"
              >
                <X size={12} /> Clear Range
              </button>
            )}
          </div>
        )}
      </div>

      {/* CRM Table */}
      <div className="overflow-x-auto border border-line bg-black/10 rounded">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint bg-black/40">
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Contact</th>
              <th className="py-3 px-3">Interested Class</th>
              <th className="py-3 px-3">Age Group</th>
              <th className="py-3 px-3">Preferred Day</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Received</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead) => {
              const isNew = lead.status === "new";
              return (
                <tr
                  key={lead.id}
                  className={clsx(
                    "border-b border-line/50 align-top transition-colors",
                    isNew ? "bg-accent/5 hover:bg-accent/10" : "hover:bg-white/5"
                  )}
                >
                  <td className="py-4 px-3 text-ink font-semibold">
                    <div className="flex items-center gap-2">
                      {lead.fullName}
                      {isNew && (
                        <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-ink-muted">
                    <span className="text-ink font-body block">{lead.phone}</span>
                    <span className="text-xs text-ink-faint block mt-0.5">{lead.email}</span>
                  </td>
                  <td className="py-4 px-3 text-ink">
                    {lead.classInterest}
                  </td>
                  <td className="py-4 px-3 text-ink-muted">{lead.ageGroup}</td>
                  <td className="py-4 px-3 text-ink-muted">
                    <div className="flex flex-wrap gap-1">
                      {lead.preferredDays.map((d) => (
                        <span key={d} className="bg-white/5 border border-white/10 text-[10px] px-1.5 py-0.5 rounded text-ink-muted">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <select
                      value={lead.status}
                      disabled={pending}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value as TrialLead["status"])
                      }
                      className={clsx(
                        "border rounded px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer",
                        getStatusStyles(lead.status)
                      )}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="trial_booked">Trial Booked</option>
                      <option value="joined">Joined</option>
                      <option value="rejected">Rejected</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="py-4 px-3 text-ink-muted text-xs whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex gap-3 items-center justify-end">
                      {lead.status !== "archived" && (
                        <button
                          onClick={() => handleArchive(lead.id)}
                          className="text-ink-muted hover:text-accent p-1 transition-colors"
                          title="Archive Lead"
                        >
                          <Archive size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(lead.id)}
                        className="text-ink-muted hover:text-accent p-1 transition-colors"
                        title="Permanently Delete Lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedLeads.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-ink-muted">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-6 pt-4 border-t border-line">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-bg-raised border border-white/10 px-2 py-1 rounded text-ink cursor-pointer focus:outline-none"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
            <span>of {totalCount} records</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-white/10 rounded text-ink-muted hover:text-accent disabled:opacity-40 disabled:hover:text-ink-muted"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-ink-muted px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-white/10 rounded text-ink-muted hover:text-accent disabled:opacity-40 disabled:hover:text-ink-muted"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm border border-accent/40 bg-bg-raised p-6 shadow-2xl rounded">
            <h4 className="font-heading text-lg font-bold text-ink">Delete Lead</h4>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn border border-white/10 px-4 py-2 text-xs text-ink-muted hover:bg-white/5 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-solid bg-accent text-white px-4 py-2 text-xs hover:bg-accent-raised rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

