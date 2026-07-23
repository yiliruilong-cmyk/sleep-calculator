export function toMinutes(value: string, fallback = 0) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return fallback;
  return hours * 60 + minutes;
}

export function wrapMinutes(value: number) {
  if (!Number.isFinite(value)) return 0;
  const day = 24 * 60;
  return ((value % day) + day) % day;
}

export function addMinutes(time: number, delta: number) {
  return wrapMinutes(time + delta);
}

export function formatTime(totalMinutes: number) {
  const minutes = wrapMinutes(Math.round(totalMinutes));
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (!minutes) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
