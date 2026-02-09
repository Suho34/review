export type Difficulty = "easy" | "medium" | "hard";

export function calculateNextReviewDate(
  difficulty: Difficulty,
  fromDate: Date = new Date(),
): Date {
  const next = new Date(fromDate);

  switch (difficulty) {
    case "easy":
      next.setDate(next.getDate() + 7);
      break;

    case "medium":
      next.setDate(next.getDate() + 3);
      break;

    case "hard":
      next.setDate(next.getDate() + 1);
      break;

    default:
      next.setDate(next.getDate() + 1);
  }

  return next;
}
