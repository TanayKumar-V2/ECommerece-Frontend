"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", query: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", query: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-brand-cream/20">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-cream rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-beige rounded-full blur-3xl opacity-40" />
        </div>

        <div className="container-custom relative z-10 text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-4"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-6"
          >
            We'd Love to Hear
            <span className="block italic text-brand-beige font-serif"> from You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground/60 text-lg font-light max-w-lg mx-auto"
          >
            Whether you have a question about your order, our products, or anything else — our team is here to help.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-4">Contact Information</h2>
              <p className="text-foreground/60 leading-relaxed">
                Have a question or just want to say hello? Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "support@viraasat.com",
                  href: "mailto:support@viraasat.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 98765 43210",
                  href: "tel:+919876543210",
                },
                {
                  icon: MapPin,
                  label: "Studio",
                  value: "Mumbai, Maharashtra, India",
                  href: "#",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 group"
                >
                  <div className="p-3 rounded-2xl bg-brand-cream border border-brand-beige/30 group-hover:bg-brand-beige/30 transition-colors shrink-0">
                    <Icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="text-foreground font-medium group-hover:text-brand-beige transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Decorative card */}
            <div className="bg-gradient-to-br from-brand-beige/40 to-brand-cream/60 border border-brand-beige/30 rounded-3xl p-8">
              <p className="text-sm text-foreground/50 uppercase tracking-widest font-semibold mb-2">Business Hours</p>
              <p className="font-heading text-xl font-medium mb-1">Monday – Saturday</p>
              <p className="text-foreground/60">10:00 AM – 7:00 PM IST</p>
              <div className="mt-4 pt-4 border-t border-brand-beige/30">
                <p className="text-sm text-foreground/60">
                  We typically respond to all queries within <span className="font-semibold text-foreground">24 hours</span>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-[2rem] shadow-xl border border-foreground/5 p-8 md:p-10"
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center gap-4"
              >
                <div className="p-4 bg-emerald-50 rounded-full">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-heading font-semibold">Message Sent!</h3>
                <p className="text-foreground/60 max-w-xs">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/80 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold mb-2">Send a Message</h2>
                  <p className="text-foreground/50 text-sm">All fields are required.</p>
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Something went wrong. Please try again.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Tanay Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-brand-cream/20 focus:outline-none focus:ring-2 focus:ring-brand-beige/60 focus:border-transparent placeholder:text-foreground/30 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-brand-cream/20 focus:outline-none focus:ring-2 focus:ring-brand-beige/60 focus:border-transparent placeholder:text-foreground/30 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-brand-cream/20 focus:outline-none focus:ring-2 focus:ring-brand-beige/60 focus:border-transparent placeholder:text-foreground/30 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-2">
                    Your Message / Query
                  </label>
                  <textarea
                    id="contact-query"
                    name="query"
                    required
                    rows={5}
                    value={form.query}
                    onChange={handleChange}
                    placeholder="Describe your query, feedback, or question in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-foreground/15 bg-brand-cream/20 focus:outline-none focus:ring-2 focus:ring-brand-beige/60 focus:border-transparent placeholder:text-foreground/30 text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="contact-submit"
                  className="w-full py-4 bg-foreground text-background font-medium rounded-full flex items-center justify-center gap-2 hover:bg-foreground/80 transition-all hover:shadow-lg hover:-translate-y-0.5 transform duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin inline-block" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
