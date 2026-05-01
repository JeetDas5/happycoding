export function calculatePoints(rating: number) {
  if (rating <= 900) return 10;
  if (rating <= 1100) return 15;
  if (rating <= 1300) return 20;
  if (rating <= 1500) return 30;
  return 50;
}
