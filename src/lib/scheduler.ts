export type Difficulty = "easy" | "medium" | "hard";

export function calculateNextReviewDate(
  difficulty: Difficulty,
  lastReviewedAt: Date | null = null,
  now: Date = new Date(),
): Date {
  const next = new Date(now);

  // Default initial intervals if never reviewed
  if (!lastReviewedAt) {
    switch (difficulty) {
      case "easy":
        next.setDate(next.getDate() + 4);
        break;
      case "medium":
        next.setDate(next.getDate() + 2);
        break;
      case "hard":
        next.setDate(next.getDate() + 1);
        break;
    }
    return next;
  }

  // Calculate previous interval in days
  const diffTime = Math.abs(now.getTime() - lastReviewedAt.getTime());
  const prevIntervalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Multipliers for spaced repetition
  let multiplier = 1;
  switch (difficulty) {
    case "easy":
      multiplier = 2.5; // Aggressive increase
      break;
    case "medium":
      multiplier = 1.5; // Moderate increase
      break;
    case "hard":
      multiplier = 0.5; // Shorten interval (or reset)
      break;
  }

  const nextInterval = Math.max(1, Math.round(prevIntervalDays * multiplier));
  next.setDate(next.getDate() + nextInterval);

  return next;
}
