"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Search, CheckCircle, Circle, BookOpen } from "lucide-react";

interface ContactMessageType {
  id: string;
  name: string;
  email: string;
  phone: string;
  query: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
}

interface ContactsClientProps {
  initialMessages: ContactMessageType[];
}

const statusConfig = {
  new: { label: "New", color: "bg-blue-50 text-blue-600 border-blue-100", icon: Circle },
  read: { label: "Read", color: "bg-amber-50 text-amber-600 border-amber-100", icon: BookOpen },
  resolved: { label: "Resolved", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle },
};

export default function ContactsClient({ initialMessages }: ContactsClientProps) {
  const [messages, setMessages] = useState<ContactMessageType[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "read" | "resolved">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateStatus = async (id: string, status: "new" | "read" | "resolved") => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    } catch {
      // silent fail
    }
  };

  const filtered = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-medium text-foreground">Contact Messages</h1>
          <p className="text-foreground/60 mt-1">
            {newCount > 0 ? (
              <span>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 align-middle" />
                {newCount} new unread {newCount === 1 ? "message" : "messages"}
              </span>
            ) : (
              "All messages have been reviewed."
            )}
          </p>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-3">
          {(["all", "new", "read", "resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
                filterStatus === s
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
              }`}
            >
              {s}
              {s !== "all" && (
                <span className="ml-1 opacity-60">({messages.filter((m) => m.status === s).length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-foreground/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand-beige/50 text-sm placeholder:text-foreground/30"
        />
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-foreground/40">
          <Mail className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-heading">No messages found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg, index) => {
            const { color, label, icon: StatusIcon } = statusConfig[msg.status];
            const isExpanded = expanded === msg.id;
            const date = new Date(msg.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const time = new Date(msg.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
                  msg.status === "new" ? "border-blue-100" : "border-foreground/5"
                }`}
              >
                {/* Card Header — always visible */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                  onClick={() => {
                    setExpanded(isExpanded ? null : msg.id);
                    if (msg.status === "new") updateStatus(msg.id, "read");
                  }}
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-brand-cream border border-brand-beige/30 flex items-center justify-center shrink-0 text-sm font-semibold text-foreground/70 uppercase">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{msg.name}</p>
                      <div className="flex items-center gap-2 text-xs text-foreground/50 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {msg.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {msg.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
                    <span className="text-xs text-foreground/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {date}, {time}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {label}
                    </span>
                  </div>
                </div>

                {/* Expanded Query */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-5 border-t border-foreground/5"
                  >
                    <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold mt-4 mb-2">
                      Message
                    </p>
                    <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.query}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <p className="text-xs text-foreground/40 mr-2">Mark as:</p>
                      {(["new", "read", "resolved"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(msg.id, s)}
                          disabled={msg.status === s}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-all ${
                            msg.status === s
                              ? statusConfig[s].color + " cursor-default"
                              : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      <a
                        href={`mailto:${msg.email}`}
                        className="ml-auto px-3 py-1 rounded-full text-xs font-medium border border-foreground/20 hover:bg-foreground hover:text-background transition-all flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> Reply
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
