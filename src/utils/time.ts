export function formatClock(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelative(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return formatClock(isoDate);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'ontem';
  }

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
