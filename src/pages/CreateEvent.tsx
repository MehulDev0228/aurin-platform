// src/pages/CreateEvent.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

function validate(input: { name: string; description: string; start_at: string; end_at: string }) {
  const errs: Record<string,string> = {};
  if (!input.name || input.name.trim().length < 3) errs.name = 'Name must be at least 3 chars.';
  if (!input.description || input.description.trim().length < 10) errs.description = 'Description must be at least 10 chars.';
  if (!input.start_at) errs.start_at = 'Start date is required.';
  if (!input.end_at) errs.end_at = 'End date is required.';
  if (input.start_at && input.end_at && new Date(input.end_at) < new Date(input.start_at)) errs.end_at = 'End must be after start.';
  return errs;
}

export default function CreateEvent() {
  const [form, setForm] = useState({ name: '', description: '', start_at: '', end_at: '' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null); setErr(null);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setBusy(true);
    try {
      const { error } = await supabase.from('events').insert({
        name: form.name.trim(),
        description: form.description.trim(),
        start_at: form.start_at,
        end_at: form.end_at,
        is_public: true,
      });
      if (error) throw error;
      setMsg('Event created ✓');
      setForm({ name: '', description: '', start_at: '', end_at: '' });
    } catch (e: any) {
      setErr(e?.message || 'Failed to create event.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Create Event</h1>
        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
              value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
            {errors.name && <div className="text-red-400 text-sm mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="text-sm text-gray-300">Description</label>
            <textarea className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
              rows={4}
              value={form.description} onChange={e=>setForm({...form, description: e.target.value})}/>
            {errors.description && <div className="text-red-400 text-sm mt-1">{errors.description}</div>}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Start</label>
              <input type="datetime-local" className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
                value={form.start_at} onChange={e=>setForm({...form, start_at: e.target.value})}/>
              {errors.start_at && <div className="text-red-400 text-sm mt-1">{errors.start_at}</div>}
            </div>
            <div>
              <label className="text-sm text-gray-300">End</label>
              <input type="datetime-local" className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
                value={form.end_at} onChange={e=>setForm({...form, end_at: e.target.value})}/>
              {errors.end_at && <div className="text-red-400 text-sm mt-1">{errors.end_at}</div>}
            </div>
          </div>

          <button onClick={submit} disabled={busy} className="px-5 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60">
            {busy ? 'Creating…' : 'Create event'}
          </button>

          {msg && <div className="text-emerald-400">{msg}</div>}
          {err && <div className="text-red-400">{err}</div>}
        </div>
      </div>
    </div>
  );
}
