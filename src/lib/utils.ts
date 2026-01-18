import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const BASE_PATH = '/anne-asad';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
