"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Edit2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import type { StudentRegistration } from "@/lib/types";
import {
  updateRegistrationStatus,
  updateRegistrationPaymentStatus,
  softDeleteRegistration,
  restoreRegistration,
  updateRegistration,
} from "@/app/admin/(dashboard)/registrations/actions";

const inputClass =
  "border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none placeholder:text-ink-faint rounded transition-colors";

const selectClass =
  "border border-white/15 bg-bg-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none rounded transition-colors cursor-pointer";

const getStatusStyles = (status: StudentRegistration["status"]) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/15 text-yellow-500 border-yellow-500/30";
    case "Contacted":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "Confirmed":
      return "bg-purple-500/15 text-purple-500 border-purple-500/30";
    case "Active":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "Completed":
      return "bg-neutral-500/15 text-neutral-400 border-neutral-500/30";
    case "Cancelled":
      return "bg-red-500/15 text-red-500 border-red-500/30";
    default:
      return "bg-white/5 text-ink border-white/10";
  }
};

const getPaymentStatusStyles = (status: StudentRegistration["paymentStatus"]) => {
  switch (status) {
    case "Pending":
      return "bg-red-500/15 text-red-500 border-red-500/30";
    case "Partial":
      return "bg-yellow-500/15 text-yellow-500 border-yellow-500/30";
    case "Paid":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    default:
      return "bg-white/5 text-ink border-white/10";
  }
};

interface RegistrationsTableProps {
  registrations: StudentRegistration[];
  danceStyles: string[];
  batchTimes: string[];
  packages: string[];
  paymentModes: string[];
  batchDays: string[];
}

export function RegistrationsTable({
  registrations,
  danceStyles,
  batchTimes,
  packages,
  paymentModes,
  batchDays,
}: RegistrationsTableProps) {
  const [pending, startTransition] = useTransition();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // Dates
  const [regDateFilter, setRegDateFilter] = useState<string>("all");
  const [regStartDate, setRegStartDate] = useState("");
  const [regEndDate, setRegEndDate] = useState("");

  const [joinDateFilter, setJoinDateFilter] = useState<string>("all");
  const [joinStartDate, setJoinStartDate] = useState("");
  const [joinEndDate, setJoinEndDate] = useState("");

  const [sortBy, setSortBy] = useState<string>("newest");

  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Action Modals State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<StudentRegistration | null>(null);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    const filtered = registrations.filter((reg) => {
      // 1. Soft-delete check
      const isDeleted = reg.deletedAt !== null;
      if (showArchived) {
        if (!isDeleted) return false; // Show ONLY archived
      } else {
        if (isDeleted) return false; // Hide archived by default
      }

      // 2. Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const noMatch = reg.registrationNo.toLowerCase().includes(query);
        const nameMatch = reg.studentName.toLowerCase().includes(query);
        const parentMatch = reg.parentName.toLowerCase().includes(query);
        const phoneMatch = reg.mobile.toLowerCase().includes(query);
        if (!noMatch && !nameMatch && !parentMatch && !phoneMatch) return false;
      }

      // 3. Status Filters
      if (statusFilter !== "all" && reg.status !== statusFilter) return false;
      if (paymentFilter !== "all" && reg.paymentStatus !== paymentFilter) return false;

      // 4. CMS Fields Filters
      if (classFilter !== "all" && reg.danceStyle !== classFilter) return false;
      if (packageFilter !== "all" && reg.package !== packageFilter) return false;
      if (batchFilter !== "all" && reg.batchTime !== batchFilter) return false;

      // 5. Registration Date Filter
      if (regDateFilter !== "all") {
        const createdDate = new Date(reg.createdAt);
        const now = new Date();
        if (regDateFilter === "today") {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (createdDate < today) return false;
        } else if (regDateFilter === "7days") {
          const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (createdDate < sevenDays) return false;
        } else if (regDateFilter === "30days") {
          const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (createdDate < thirtyDays) return false;
        } else if (regDateFilter === "custom") {
          if (regStartDate) {
            const start = new Date(regStartDate);
            start.setHours(0, 0, 0, 0);
            if (createdDate < start) return false;
          }
          if (regEndDate) {
            const end = new Date(regEndDate);
            end.setHours(23, 59, 59, 999);
            if (createdDate > end) return false;
          }
        }
      }

      // 6. Joining Date Filter
      if (joinDateFilter !== "all") {
        const joiningDate = new Date(reg.joiningDate);
        const now = new Date();
        if (joinDateFilter === "upcoming") {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (joiningDate < today) return false;
        } else if (joinDateFilter === "thisMonth") {
          const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          if (joiningDate < startMonth || joiningDate > endMonth) return false;
        } else if (joinDateFilter === "custom") {
          if (joinStartDate) {
            const start = new Date(joinStartDate);
            start.setHours(0, 0, 0, 0);
            if (joiningDate < start) return false;
          }
          if (joinEndDate) {
            const end = new Date(joinEndDate);
            end.setHours(23, 59, 59, 999);
            if (joiningDate > end) return false;
          }
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
        return a.studentName.localeCompare(b.studentName);
      } else if (sortBy === "name-desc") {
        return b.studentName.localeCompare(a.studentName);
      }
      return 0;
    });
  }, [
    registrations,
    search,
    statusFilter,
    paymentFilter,
    classFilter,
    packageFilter,
    batchFilter,
    showArchived,
    regDateFilter,
    regStartDate,
    regEndDate,
    joinDateFilter,
    joinStartDate,
    joinEndDate,
    sortBy,
  ]);

  // Paginated data
  const totalCount = filteredAndSorted.length;
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const paginated = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredAndSorted.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredAndSorted, currentPage, rowsPerPage]);

  const handleStatusChange = (id: string, newStatus: StudentRegistration["status"]) => {
    startTransition(async () => {
      const res = await updateRegistrationStatus(id, newStatus);
      if (!res.success) {
        alert(res.error ?? "Failed to update status.");
      }
    });
  };

  const handlePaymentStatusChange = (id: string, newPaymentStatus: StudentRegistration["paymentStatus"]) => {
    startTransition(async () => {
      const res = await updateRegistrationPaymentStatus(id, newPaymentStatus);
      if (!res.success) {
        alert(res.error ?? "Failed to update payment status.");
      }
    });
  };

  const handleSoftDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const res = await softDeleteRegistration(deleteId);
      if (res.success) {
        setDeleteId(null);
      } else {
        alert(res.error ?? "Failed to archive registration.");
      }
    });
  };

  const handleRestore = () => {
    if (!restoreId) return;
    startTransition(async () => {
      const res = await restoreRegistration(restoreId);
      if (res.success) {
        setRestoreId(null);
      } else {
        alert(res.error ?? "Failed to restore registration.");
      }
    });
  };

  // EXPORT UTILITIES
  const handleExportCSV = () => {
    const headers = [
      "Registration ID",
      "Student Name",
      "Parent Name",
      "Phone",
      "Email",
      "DOB",
      "Age",
      "Dance Style",
      "Batch Time",
      "Package",
      "Payment Mode",
      "Batch Days",
      "Joining Date",
      "Payment Status",
      "Registration Status",
      "Created Date",
      "Notes",
      "Internal Notes",
    ];

    const rows = filteredAndSorted.map((reg) => [
      reg.registrationNo,
      reg.studentName,
      reg.parentName,
      reg.mobile,
      reg.email ?? "",
      reg.dob,
      reg.age,
      reg.danceStyle,
      reg.batchTime,
      reg.package,
      reg.paymentMode,
      reg.batchDays,
      reg.joiningDate,
      reg.paymentStatus,
      reg.status,
      new Date(reg.createdAt).toLocaleString(),
      reg.notes ?? "",
      reg.internalNotes ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student_registrations_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    let table = `<table border="1">
      <thead>
        <tr style="background-color: #1a1a1a; color: #ffffff; font-weight: bold;">
          <th>Registration ID</th>
          <th>Student Name</th>
          <th>Parent Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>DOB</th>
          <th>Age</th>
          <th>Dance Style</th>
          <th>Batch Time</th>
          <th>Package</th>
          <th>Payment Mode</th>
          <th>Batch Days</th>
          <th>Joining Date</th>
          <th>Payment Status</th>
          <th>Registration Status</th>
          <th>Created Date</th>
          <th>Notes</th>
          <th>Internal Notes</th>
        </tr>
      </thead>
      <tbody>`;

    filteredAndSorted.forEach((reg) => {
      table += `<tr>
        <td>${reg.registrationNo}</td>
        <td>${reg.studentName}</td>
        <td>${reg.parentName}</td>
        <td>${reg.mobile}</td>
        <td>${reg.email ?? ""}</td>
        <td>${reg.dob}</td>
        <td>${reg.age}</td>
        <td>${reg.danceStyle}</td>
        <td>${reg.batchTime}</td>
        <td>${reg.package}</td>
        <td>${reg.paymentMode}</td>
        <td>${reg.batchDays}</td>
        <td>${reg.joiningDate}</td>
        <td>${reg.paymentStatus}</td>
        <td>${reg.status}</td>
        <td>${new Date(reg.createdAt).toLocaleString()}</td>
        <td>${reg.notes ?? ""}</td>
        <td>${reg.internalNotes ?? ""}</td>
      </tr>`;
    });

    table += `</tbody></table>`;

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Registrations</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body style="background-color: #ffffff; font-family: sans-serif;">${table}</body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student_registrations_export_${new Date().toISOString().split("T")[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (setter: (v: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  // Keep track of DOB changes in edit modal for dynamic age calculation
  const [editDob, setEditDob] = useState("");
  useEffect(() => {
    if (editItem) {
      setEditDob(editItem.dob);
    }
  }, [editItem]);

  const handleEditDobChange = (dobVal: string) => {
    setEditDob(dobVal);
    if (editItem) {
      const birthDate = new Date(dobVal);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setEditItem({
          ...editItem,
          dob: dobVal,
          age: Math.max(0, calculatedAge),
        });
      }
    }
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedData: Partial<StudentRegistration> = {
      studentName: formData.get("studentName") as string,
      parentName: formData.get("parentName") as string,
      mobile: formData.get("mobile") as string,
      email: (formData.get("email") as string) || undefined,
      dob: editItem.dob,
      age: editItem.age,
      joiningDate: formData.get("joiningDate") as string,
      danceStyle: formData.get("danceStyle") as string,
      batchTime: formData.get("batchTime") as string,
      package: formData.get("package") as string,
      paymentMode: formData.get("paymentMode") as string,
      batchDays: formData.get("batchDays") as string,
      emergencyContact: (formData.get("emergencyContact") as string) || undefined,
      medicalCondition: (formData.get("medicalCondition") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      internalNotes: (formData.get("internalNotes") as string) || undefined,
      status: formData.get("status") as StudentRegistration["status"],
      paymentStatus: formData.get("paymentStatus") as StudentRegistration["paymentStatus"],
    };

    startTransition(async () => {
      const res = await updateRegistration(editItem.id, updatedData);
      if (res.success) {
        setEditItem(null);
      } else {
        alert(res.error ?? "Failed to save updates.");
      }
    });
  };

  return (
    <div className="flex flex-col">
      {/* CRM Actions & Filters Panel */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search, Archive Toggle and Export Row */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search Reg ID, name, parent, phone..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className={clsx(inputClass, "w-full pl-9")}
            />
          </div>
          <div className="flex flex-wrap gap-2 shrink-0 items-center justify-end">
            <button
              onClick={() => {
                setShowArchived(!showArchived);
                setCurrentPage(1);
              }}
              className={clsx(
                "btn text-xs py-2 px-3 rounded flex items-center gap-1.5 border transition-all",
                showArchived
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-white/10 hover:border-accent text-ink-muted hover:text-accent"
              )}
              title="Show deleted registrations"
            >
              <Trash2 size={13} />
              <span>{showArchived ? "Showing Deleted" : "Show Deleted"}</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={totalCount === 0}
              className="btn border border-white/10 hover:border-accent text-xs flex items-center gap-1.5 py-2 px-3 rounded text-ink-muted hover:text-accent disabled:opacity-40"
              title="Export CSV"
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={handleExportExcel}
              disabled={totalCount === 0}
              className="btn border border-white/10 hover:border-accent text-xs flex items-center gap-1.5 py-2 px-3 rounded text-ink-muted hover:text-accent disabled:opacity-40"
              title="Export Excel"
            >
              <Download size={14} /> Excel
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-3">
          {/* Status filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Payment</label>
            <select
              value={paymentFilter}
              onChange={(e) => handleFilterChange(setPaymentFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Payments</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {/* Dance Style filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Dance Style</label>
            <select
              value={classFilter}
              onChange={(e) => handleFilterChange(setClassFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Styles</option>
              {danceStyles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          {/* Package filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Package</label>
            <select
              value={packageFilter}
              onChange={(e) => handleFilterChange(setPackageFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Packages</option>
              {packages.map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>

          {/* Batch Time filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Batch Time</label>
            <select
              value={batchFilter}
              onChange={(e) => handleFilterChange(setBatchFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Times</option>
              {batchTimes.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Reg Date filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Reg. Date</label>
            <select
              value={regDateFilter}
              onChange={(e) => handleFilterChange(setRegDateFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom...</option>
            </select>
          </div>

          {/* Join Date filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">Joining Date</label>
            <select
              value={joinDateFilter}
              onChange={(e) => handleFilterChange(setJoinDateFilter, e.target.value)}
              className={selectClass}
            >
              <option value="all">All Time</option>
              <option value="upcoming">Upcoming</option>
              <option value="thisMonth">This Month</option>
              <option value="custom">Custom...</option>
            </select>
          </div>

          {/* Sort order */}
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

        {/* Custom Date Ranges */}
        {regDateFilter === "custom" && (
          <div className="flex flex-wrap gap-3 p-3 bg-black/20 border border-white/5 rounded items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">Reg. From</label>
              <input
                type="date"
                value={regStartDate}
                onChange={(e) => handleFilterChange(setRegStartDate, e.target.value)}
                className={clsx(inputClass, "!py-1 !px-2 text-xs")}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">Reg. To</label>
              <input
                type="date"
                value={regEndDate}
                onChange={(e) => handleFilterChange(setRegEndDate, e.target.value)}
                className={clsx(inputClass, "!py-1 !px-2 text-xs")}
              />
            </div>
          </div>
        )}

        {joinDateFilter === "custom" && (
          <div className="flex flex-wrap gap-3 p-3 bg-black/20 border border-white/5 rounded items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">Join From</label>
              <input
                type="date"
                value={joinStartDate}
                onChange={(e) => handleFilterChange(setJoinStartDate, e.target.value)}
                className={clsx(inputClass, "!py-1 !px-2 text-xs")}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">Join To</label>
              <input
                type="date"
                value={joinEndDate}
                onChange={(e) => handleFilterChange(setJoinEndDate, e.target.value)}
                className={clsx(inputClass, "!py-1 !px-2 text-xs")}
              />
            </div>
          </div>
        )}
      </div>

      {/* CRM Table */}
      <div className="overflow-x-auto border border-line bg-black/10 rounded">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint bg-black/40">
              <th className="py-3 px-3">Registration ID</th>
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3">Parent Name</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Dance Style</th>
              <th className="py-3 px-3">Batch Time</th>
              <th className="py-3 px-3">Package</th>
              <th className="py-3 px-3">Payment</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Joining Date</th>
              <th className="py-3 px-3">Registered</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((reg) => {
              const isUnread = !reg.viewed;
              return (
                <tr
                  key={reg.id}
                  className={clsx(
                    "border-b border-line/50 align-middle transition-colors",
                    isUnread ? "bg-accent/5 hover:bg-accent/10 font-medium" : "hover:bg-white/5"
                  )}
                >
                  <td className="py-4 px-3 text-ink font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{reg.registrationNo}</span>
                      {isUnread && (
                        <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-ink">
                    {reg.studentName}
                  </td>
                  <td className="py-4 px-3 text-ink-muted">
                    {reg.parentName}
                  </td>
                  <td className="py-4 px-3 text-ink font-body">
                    {reg.mobile}
                  </td>
                  <td className="py-4 px-3 text-ink">
                    {reg.danceStyle}
                  </td>
                  <td className="py-4 px-3 text-ink-muted">
                    {reg.batchTime}
                  </td>
                  <td className="py-4 px-3 text-ink-muted">
                    {reg.package}
                  </td>
                  <td className="py-4 px-3">
                    <select
                      value={reg.paymentStatus}
                      disabled={pending}
                      onChange={(e) =>
                        handlePaymentStatusChange(reg.id, e.target.value as StudentRegistration["paymentStatus"])
                      }
                      className={clsx(
                        "border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer",
                        getPaymentStatusStyles(reg.paymentStatus)
                      )}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="py-4 px-3">
                    <select
                      value={reg.status}
                      disabled={pending}
                      onChange={(e) =>
                        handleStatusChange(reg.id, e.target.value as StudentRegistration["status"])
                      }
                      className={clsx(
                        "border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer",
                        getStatusStyles(reg.status)
                      )}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-3 text-ink-muted text-xs whitespace-nowrap">
                    {new Date(reg.joiningDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-3 text-ink-muted text-xs whitespace-nowrap">
                    {new Date(reg.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-3 text-right whitespace-nowrap">
                    <div className="flex gap-2.5 items-center justify-end">
                      <Link
                        href={`/admin/registrations/${reg.id}`}
                        className="text-ink-muted hover:text-accent p-1 transition-colors"
                        title="View Profile Details & History"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => setEditItem(reg)}
                        className="text-ink-muted hover:text-accent p-1 transition-colors"
                        title="Edit Student Info"
                      >
                        <Edit2 size={14} />
                      </button>
                      {reg.deletedAt ? (
                        <button
                          onClick={() => setRestoreId(reg.id)}
                          className="text-emerald-500 hover:text-emerald-400 p-1 transition-colors"
                          title="Restore soft-deleted registration"
                        >
                          <RefreshCw size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteId(reg.id)}
                          className="text-ink-muted hover:text-accent p-1 transition-colors"
                          title="Soft-Delete (Archive)"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={12} className="py-12 text-center text-ink-muted">
                  No registrations found.
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

      {/* Soft-Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm border border-accent/40 bg-bg-raised p-6 shadow-2xl rounded text-left">
            <div className="flex items-center gap-2 text-accent">
              <AlertTriangle size={20} />
              <h4 className="font-heading text-base font-bold uppercase tracking-wider text-ink">Archive Student</h4>
            </div>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed font-body">
              Are you sure you want to soft-delete/archive this registration? It will be hidden from the active registrations list, but can be viewed and restored later from the &quot;Show Deleted&quot; list.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn border border-white/10 px-4 py-2 text-xs text-ink-muted hover:bg-white/5 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="btn-solid bg-accent text-white px-4 py-2 text-xs hover:bg-accent-raised rounded"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {restoreId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm border border-emerald-500/40 bg-bg-raised p-6 shadow-2xl rounded text-left">
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-ink">Restore Student</h4>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed font-body">
              Do you want to restore this registration back to the active list?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setRestoreId(null)}
                className="btn border border-white/10 px-4 py-2 text-xs text-ink-muted hover:bg-white/5 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                className="btn bg-emerald-600 text-white px-4 py-2 text-xs hover:bg-emerald-500 rounded"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Info Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl border border-white/10 bg-bg-raised p-6 md:p-8 shadow-2xl rounded text-left my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h4 className="font-heading text-lg font-bold text-ink uppercase tracking-wide">
                Edit Student Details: <span className="font-mono text-accent">{editItem.registrationNo}</span>
              </h4>
              <button
                onClick={() => setEditItem(null)}
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Student Name</label>
                  <input
                    type="text"
                    name="studentName"
                    defaultValue={editItem.studentName}
                    required
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Parent Name</label>
                  <input
                    type="text"
                    name="parentName"
                    defaultValue={editItem.parentName}
                    required
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    defaultValue={editItem.mobile}
                    required
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editItem.email || ""}
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={editDob}
                    onChange={(e) => handleEditDobChange(e.target.value)}
                    required
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Age (Calculated)</label>
                  <input
                    type="number"
                    name="age"
                    value={editItem.age}
                    readOnly
                    className={clsx(inputClass, "w-full bg-white/5 text-ink-muted cursor-not-allowed")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    defaultValue={editItem.joiningDate}
                    required
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Dance Style</label>
                  <select
                    name="danceStyle"
                    defaultValue={editItem.danceStyle}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    {danceStyles.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Batch Time</label>
                  <select
                    name="batchTime"
                    defaultValue={editItem.batchTime}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    {batchTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Package</label>
                  <select
                    name="package"
                    defaultValue={editItem.package}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Batch Days</label>
                  <select
                    name="batchDays"
                    defaultValue={editItem.batchDays}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    {batchDays.map((dayOption) => (
                      <option key={dayOption} value={dayOption}>{dayOption}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Payment Mode</label>
                  <select
                    name="paymentMode"
                    defaultValue={editItem.paymentMode}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    defaultValue={editItem.emergencyContact || ""}
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Medical Condition</label>
                  <input
                    type="text"
                    name="medicalCondition"
                    defaultValue={editItem.medicalCondition || ""}
                    className={clsx(inputClass, "w-full")}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Registration Notes (Student)</label>
                <textarea
                  name="notes"
                  defaultValue={editItem.notes || ""}
                  rows={2}
                  className={clsx(inputClass, "w-full")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Admission Status</label>
                  <select
                    name="status"
                    defaultValue={editItem.status}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Payment Status</label>
                  <select
                    name="paymentStatus"
                    defaultValue={editItem.paymentStatus}
                    required
                    className={clsx(selectClass, "w-full")}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1">Internal Notes (Admin)</label>
                <textarea
                  name="internalNotes"
                  defaultValue={editItem.internalNotes || ""}
                  rows={3}
                  placeholder="Add internal notes about payment, follow ups, etc..."
                  className={clsx(inputClass, "w-full border-accent/20 focus:border-accent")}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="btn border border-white/10 px-5 py-2.5 text-xs text-ink-muted hover:bg-white/5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-solid bg-accent text-white px-5 py-2.5 text-xs hover:bg-accent-raised rounded flex items-center gap-2"
                >
                  {pending && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
