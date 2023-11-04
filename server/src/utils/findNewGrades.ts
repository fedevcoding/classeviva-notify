import { Grade } from "@/types";

export const findNewGrades = (oldGrades: Grade[], latestGrades: Grade[]): Grade[] => {
  const newGrades: Grade[] = [];

  for (const latestGrade of latestGrades) {
    const oldGrade = oldGrades.find(oldGrade => JSON.stringify(oldGrade) === JSON.stringify(latestGrade));
    if (!oldGrade) newGrades.push(latestGrade);
  }

  return newGrades;
};
