"use client";

import Link from "next/link";
import { useState } from "react";

export default function TicketForm({ dict, locale }: { dict: any, locale: string }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 2000;
  const ticket = dict.ticketPage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao criar ticket");

      setProtocol(data.protocol);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
      {protocol ? (
        <div className="text-center py-10 animate-in zoom-in duration-500">
          <div className="size-24 bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl">check_circle</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{ticket.success.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{ticket.success.subtitle}</p>
          
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 inline-block mb-10">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">{ticket.success.protocol}</p>
            <p className="text-3xl font-mono font-black text-blue-600 tracking-wider">{protocol}</p>
          </div>

          <div>
            <Link href={`/${locale}/support`} className="inline-flex justify-center w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {ticket.success.back}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{ticket.form.email}</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={ticket.form.emailPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{ticket.form.subject}</label>
            <input 
              type="text" 
              required 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={ticket.form.subjectPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="flex justify-between items-end mb-2">
              <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">{ticket.form.message}</span>
              <span className={`text-xs font-bold ${message.length >= MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
                {MAX_CHARS - message.length} {ticket.form.charLimit}
              </span>
            </label>
            <textarea 
              required 
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={MAX_CHARS}
              rows={6}
              placeholder={ticket.form.messagePlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading || !email || !subject || !message}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {ticket.form.submitting}
              </>
            ) : (
              ticket.form.submit
            )}
          </button>
        </form>
      )}
    </div>
  );
}
