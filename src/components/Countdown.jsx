import { useEffect, useState } from "react";

function getRemaining(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    finished: diff <= 0
  };
}

export default function Countdown({ target }) {
  const [time, setTime] = useState(() => getRemaining(target));
  useEffect(() => {
    const timer = window.setInterval(() => setTime(getRemaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const units = [
    ["Hari", time.days],
    ["Jam", time.hours],
    ["Menit", time.minutes],
    ["Detik", time.seconds]
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {units.map(([label, value]) => (
        <div key={label} className="count-box">
          <span className="font-sans text-3xl font-semibold text-champagne sm:text-5xl">{String(value).padStart(2, "0")}</span>
          <span className="mt-1 text-[9px] uppercase tracking-[.18em] text-ivory/65 sm:text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}