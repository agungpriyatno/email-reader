import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const lastWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};
