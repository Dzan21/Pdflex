export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}