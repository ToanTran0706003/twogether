export const haptic = {
  light: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
  },
  medium: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20)
    }
  },
  success: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([10, 50, 10])
    }
  },
  error: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 10, 50])
    }
  },
}
