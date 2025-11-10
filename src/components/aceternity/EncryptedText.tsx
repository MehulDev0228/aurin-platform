// src/components/aceternity/EncryptedText.tsx
import { useEffect, useMemo, useState } from 'react';
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function EncryptedText({ text, className = '' }: { text: string; className?: string }) {
  const [out, setOut] = useState(text);
  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setOut(chars.map((c, idx) => (idx < i ? c : pool[Math.floor(Math.random()*pool.length)])).join(''));
      if (i >= chars.length) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [chars]);

  return <span className={className}>{out}</span>;
}
