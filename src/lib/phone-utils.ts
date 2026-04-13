export function formatPhone(value: string): string {
  const clean = value.replace(/[^0-9]/g, "");
  if (!clean) return "";
  let result = "";
  if (clean.length <= 2) {
    result = `+${clean}`;
  } else if (clean.length <= 3) {
    result = `+${clean.slice(0, 2)} ${clean.slice(2)}`;
  } else if (clean.length <= 7) {
    result = `+${clean.slice(0, 2)} ${clean.slice(2, 3)} ${clean.slice(3)}`;
  } else {
    result = `+${clean.slice(0, 2)} ${clean.slice(2, 3)} ${clean.slice(3, 7)} ${clean.slice(7, 11)}`;
  }
  return result;
}

export function isValidPhone(phone: string): boolean {
  return phone.replace(/[^0-9]/g, "").length >= 11;
}
