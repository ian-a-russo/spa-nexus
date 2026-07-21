const GRADIENTS = [
  ['#25d366', '#128c7e'],
  ['#7c4dff', '#00e5ff'],
  ['#ff6b9d', '#7c4dff'],
  ['#ffb020', '#ff6b9d'],
  ['#00e5ff', '#25d366'],
  ['#ff5470', '#ffb020'],
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gradientFor(seed: string): string {
  const [from, to] = GRADIENTS[hashString(seed) % GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

export function initialsFor(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
