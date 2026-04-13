export function formatRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, "");
  if (!clean) return "";
  const dv = clean.slice(-1).toUpperCase();
  const rut = clean.slice(0, -1);
  if (!rut) return dv;
  const formatted = rut.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

export function validateRut(rut: string): boolean {
  if (!rut) return false;
  const clean = rut.replace(/[^0-9kK]/g, "");
  if (clean.length < 2 || clean.length > 9) return false;
  const dv = clean.slice(-1).toUpperCase();
  const rutBody = clean.slice(0, -1);
  if (!rutBody || !dv) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDv = 11 - (sum % 11);
  const dvMap: Record<number, string> = { 11: "0", 10: "K" };
  return dv === (dvMap[expectedDv] || expectedDv.toString());
}
