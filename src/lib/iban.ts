// Mock Egyptian IBAN generator with valid mod-97 checksum.
// EG + 2 check digits + 4 bank code + 4 branch + 17 BBAN digits = 29 chars total
// Per SWIFT spec, Egypt IBAN is 29 characters.

function mod97(s: string): number {
  // process in chunks to avoid bigint overhead
  let remainder = "";
  for (const ch of s) {
    remainder += ch;
    if (remainder.length >= 9) {
      remainder = (parseInt(remainder, 10) % 97).toString();
    }
  }
  return parseInt(remainder, 10) % 97;
}

const rand = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

export function generateEGIban(): string {
  // Bank: 0019 (mock SUMERGE), Branch: 0001
  const bban = `0019` + `0001` + rand(17);
  // Move country + 00 to end, convert letters to numbers (E=14, G=16)
  const rearranged = bban + "1416" + "00";
  const remainder = mod97(rearranged);
  const check = (98 - remainder).toString().padStart(2, "0");
  const iban = `EG${check}${bban}`;
  return iban;
}

export function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

export function generateAccountNumber(): string {
  return rand(12);
}

export function generateCifNumber(): string {
  return "CIF-" + rand(8);
}