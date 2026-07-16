"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, User, Calendar, DollarSign, FileText, Check, Clock, ShieldAlert } from "lucide-react";
import type { StudentRegistration, RegistrationStatusHistory } from "@/lib/types";

const cardClass = "bg-bg-raised/20 border border-white/5 p-6 rounded-lg";
const labelClass = "text-[10px] font-bold uppercase tracking-wider text-ink-faint";
const valueClass = "text-sm text-ink font-semibold mt-1";

interface RegistrationProfileEditorProps {
  registration: StudentRegistration;
  history: RegistrationStatusHistory[];
  onUpdateStatus: (status: StudentRegistration["status"]) => Promise<{ success: boolean; error?: string }>;
  onUpdatePaymentStatus: (status: StudentRegistration["paymentStatus"]) => Promise<{ success: boolean; error?: string }>;
  onUpdateNotes: (notes: string) => Promise<{ success: boolean; error?: string }>;
}

export function RegistrationProfileEditor({
  registration,
  history,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onUpdateNotes,
}: RegistrationProfileEditorProps) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(registration.status);
  const [paymentStatus, setPaymentStatus] = useState(registration.paymentStatus);
  const [internalNotes, setInternalNotes] = useState(registration.internalNotes || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStatusChange = (newStatus: StudentRegistration["status"]) => {
    setStatus(newStatus);
    startTransition(async () => {
      const res = await onUpdateStatus(newStatus);
      if (!res.success) {
        alert(res.error ?? "Failed to update status");
        setStatus(registration.status);
      }
    });
  };

  const handlePaymentStatusChange = (newPaymentStatus: StudentRegistration["paymentStatus"]) => {
    setPaymentStatus(newPaymentStatus);
    startTransition(async () => {
      const res = await onUpdatePaymentStatus(newPaymentStatus);
      if (!res.success) {
        alert(res.error ?? "Failed to update payment status");
        setPaymentStatus(registration.paymentStatus);
      }
    });
  };

  const handleSaveNotes = () => {
    setSaveSuccess(false);
    startTransition(async () => {
      const res = await onUpdateNotes(internalNotes);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(res.error ?? "Failed to save notes");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/registrations"
          className="flex items-center gap-2 border border-white/10 hover:border-accent hover:bg-accent/5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-all duration-150"
        >
          <ArrowLeft size={14} /> Back to Registrations
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0c0c0d] border border-white/10 p-6 rounded-lg gap-4">
        <div>
          <span className="font-mono text-xs text-accent uppercase font-bold tracking-wider">{registration.registrationNo}</span>
          <h2 className="font-display text-2xl text-ink font-bold mt-1 uppercase">{registration.studentName}</h2>
          <p className="text-xs text-ink-muted mt-0.5">Registered on {new Date(registration.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Status select */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-ink-faint">Status</span>
            <select
              value={status}
              disabled={pending}
              onChange={(e) => handleStatusChange(e.target.value as StudentRegistration["status"])}
              className="border border-white/10 bg-bg-raised px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none rounded transition-colors cursor-pointer font-bold uppercase tracking-wide"
            >
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment status select */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-ink-faint">Payment Status</span>
            <select
              value={paymentStatus}
              disabled={pending}
              onChange={(e) => handlePaymentStatusChange(e.target.value as StudentRegistration["paymentStatus"])}
              className="border border-white/10 bg-bg-raised px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none rounded transition-colors cursor-pointer font-bold uppercase tracking-wide"
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left Column: Personal and Joining Details */}
        <div className="flex flex-col gap-6">
          {/* Personal Info Card */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 text-accent border-b border-white/10 pb-3 mb-5">
              <User size={16} />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className={labelClass}>Student Name</p>
                <p className={valueClass}>{registration.studentName}</p>
              </div>
              <div>
                <p className={labelClass}>Parent / Guardian Name</p>
                <p className={valueClass}>{registration.parentName}</p>
              </div>
              <div>
                <p className={labelClass}>Mobile Number</p>
                <p className={valueClass}>{registration.mobile}</p>
              </div>
              <div>
                <p className={labelClass}>Email Address</p>
                <p className={valueClass}>{registration.email || "N/A"}</p>
              </div>
              <div>
                <p className={labelClass}>Date of Birth</p>
                <p className={valueClass}>
                  {new Date(registration.dob).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className={labelClass}>Age</p>
                <p className={valueClass}>{registration.age} years old</p>
              </div>
            </div>
          </div>

          {/* Joining Info Card */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 text-accent border-b border-white/10 pb-3 mb-5">
              <Calendar size={16} />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink">Joining & Schedule Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className={labelClass}>Joining Date</p>
                <p className={valueClass}>
                  {new Date(registration.joiningDate).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className={labelClass}>Dance Style</p>
                <p className={valueClass}>{registration.danceStyle}</p>
              </div>
              <div>
                <p className={labelClass}>Batch Time</p>
                <p className={valueClass}>{registration.batchTime}</p>
              </div>
              <div>
                <p className={labelClass}>Batch Days</p>
                <p className={valueClass}>{registration.batchDays}</p>
              </div>
              <div>
                <p className={labelClass}>Package Plan</p>
                <p className={valueClass}>{registration.package}</p>
              </div>
            </div>
          </div>

          {/* Payment & Terms Info Card */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 text-accent border-b border-white/10 pb-3 mb-5">
              <DollarSign size={16} />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink">Payment & Agreement Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className={labelClass}>Payment Mode</p>
                <p className={valueClass}>{registration.paymentMode}</p>
              </div>
              <div>
                <p className={labelClass}>Non-Refundable Fee Agreement</p>
                <p className="text-sm font-semibold flex items-center gap-1.5 mt-1 text-emerald-400">
                  <Check size={16} /> Agreed & Accepted
                </p>
              </div>
              {registration.emergencyContact && (
                <div className="sm:col-span-2">
                  <p className={labelClass}>Emergency Contact</p>
                  <p className={valueClass}>{registration.emergencyContact}</p>
                </div>
              )}
              {registration.medicalCondition && (
                <div className="sm:col-span-2">
                  <p className={labelClass}>Medical Condition(s)</p>
                  <p className="text-sm text-yellow-400 font-semibold mt-1 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="shrink-0" />
                    {registration.medicalCondition}
                  </p>
                </div>
              )}
              {registration.notes && (
                <div className="sm:col-span-2 border-t border-white/5 pt-3 mt-1">
                  <p className={labelClass}>Student Notes</p>
                  <p className="text-sm text-ink-muted leading-relaxed font-body mt-1">{registration.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Internal Notes & Status History Timeline */}
        <div className="flex flex-col gap-6">
          {/* Internal Notes Editor */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 text-accent border-b border-white/10 pb-3 mb-4">
              <FileText size={16} />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink">Internal Notes</h3>
            </div>
            <div className="flex flex-col gap-3">
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Write internal admin notes about this student (e.g., follow ups, fees paid)..."
                rows={4}
                className="w-full border border-white/15 bg-bg-raised px-3 py-2 font-body text-xs text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none transition-colors rounded resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {saveSuccess && "✓ Notes saved successfully"}
                </span>
                <button
                  onClick={handleSaveNotes}
                  disabled={pending}
                  className="btn-solid bg-accent text-white px-4 py-1.5 text-[11px] font-heading font-bold uppercase tracking-wide hover:bg-accent-raised rounded flex items-center gap-1.5"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* Audit Timeline Card */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 text-accent border-b border-white/10 pb-3 mb-5">
              <Clock size={16} />
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink">Status Audit Timeline</h3>
            </div>
            
            <div className="relative pl-6 flex flex-col gap-6 border-l border-white/10 ml-2">
              {history.map((log) => (
                <div key={log.id} className="relative">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 border-accent bg-[#070708]" />

                  <div>
                    <p className="text-xs text-ink font-semibold flex items-center gap-1.5 flex-wrap">
                      <span>Changed by</span>
                      <span className="font-mono text-accent text-[11px] bg-accent/5 border border-accent/10 px-1 rounded">{log.changedBy}</span>
                    </p>
                    
                    <div className="flex flex-col gap-1 mt-2 text-[11px] text-ink-muted">
                      {log.newStatus && log.oldStatus !== log.newStatus && (
                        <p>
                          Status: <span className="text-ink font-semibold">{log.oldStatus || "None"}</span> → <span className="text-accent font-semibold">{log.newStatus}</span>
                        </p>
                      )}
                      {log.newPaymentStatus && log.oldPaymentStatus !== log.newPaymentStatus && (
                        <p>
                          Payment: <span className="text-ink font-semibold">{log.oldPaymentStatus || "None"}</span> → <span className="text-accent font-semibold">{log.newPaymentStatus}</span>
                        </p>
                      )}
                      {log.internalNotes && (
                        <p className="italic font-body text-ink-faint mt-1 pl-2 border-l border-white/10">
                          {log.internalNotes}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-ink-faint font-medium mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
