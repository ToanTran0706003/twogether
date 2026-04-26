import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTH_NAMES = [
  "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
  "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
]

export function formatDate(date: Date): string {
  const day = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

export function daysBetween(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffMs = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffMs / msPerDay)
}

export function getCoupleDays(anniversary: string): number {
  const annivDate = new Date(anniversary)
  const today = new Date()
  return daysBetween(annivDate, today)
}
