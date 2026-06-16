// Mocked integration adapters. Swap implementations for production providers.
import { auditLog } from "./audit";
import { generateEGIban, generateAccountNumber, generateCifNumber } from "./iban";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type OcrResult = {
  fullName: string;
  nationalId: string;
  dob: string;
  expiry: string;
  gender: "M" | "F";
  address: string;
};

export const ocr = {
  async extractFromId(_file: unknown): Promise<OcrResult> {
    auditLog("ocr.extractFromId.start");
    await delay(1800);
    const result: OcrResult = {
      fullName: "Ahmed Mohamed Ibrahim",
      nationalId: "29801011234567",
      dob: "1998-01-01",
      expiry: "2031-05-22",
      gender: "M",
      address: "12 Tahrir St, Cairo",
    };
    auditLog("ocr.extractFromId.done", { fields: Object.keys(result).length });
    return result;
  },
};

export const haweya = {
  async verifyIdentity(nationalId: string) {
    auditLog("haweya.verify.start", { nationalId: nationalId.slice(0, 4) + "***" });
    await delay(1200);
    auditLog("haweya.verify.done");
    return { verified: true, score: 0.97 };
  },
};

export const biometrics = {
  async livenessCheck(): Promise<{ live: boolean; score: number }> {
    await delay(900);
    return { live: true, score: 0.94 };
  },
  async faceMatch(): Promise<{ match: boolean; score: number }> {
    await delay(900);
    return { match: true, score: 0.91 };
  },
};

export const aml = {
  async screen(_name: string): Promise<{ pep: boolean; sanctions: boolean; watchlist: boolean; adverseMedia: boolean }> {
    auditLog("aml.screen.start");
    await delay(1500);
    const result = { pep: false, sanctions: false, watchlist: false, adverseMedia: false };
    auditLog("aml.screen.done", result);
    return result;
  },
};

export type Risk = "low" | "medium" | "high";

export const risk = {
  score(input: { pep: boolean; income: number; nationality: string }): Risk {
    let s = 0;
    if (input.pep) s += 50;
    if (input.income > 100_000) s += 10;
    if (input.nationality && input.nationality !== "Egyptian") s += 20;
    if (s >= 50) return "high";
    if (s >= 20) return "medium";
    return "low";
  },
};

export const coreBanking = {
  async createCustomer(_profile: Record<string, unknown>) {
    auditLog("core.createCif.start");
    await delay(1500);
    const cif = generateCifNumber();
    auditLog("core.createCif.done", { cif });
    return { cif };
  },
  async openAccount(_cif: string, _product: string) {
    auditLog("core.openAccount.start");
    await delay(1500);
    const result = {
      accountNumber: generateAccountNumber(),
      iban: generateEGIban(),
    };
    auditLog("core.openAccount.done", { accountNumber: result.accountNumber });
    return result;
  },
};

export const cms = {
  async issueCard(_cif: string, type: "virtual" | "physical") {
    auditLog("cms.issueCard.start", { type });
    await delay(900);
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    auditLog("cms.issueCard.done", { last4 });
    return { last4, type, status: type === "virtual" ? "active" : "shipping" as const };
  },
};

export const sms = {
  async send(to: string, message: string) {
    auditLog("sms.send", { to: to.slice(-3), len: message.length });
    await delay(300);
    return { delivered: true };
  },
};

export const email = {
  async send(to: string, subject: string) {
    auditLog("email.send", { to: to.split("@")[1], subject });
    await delay(300);
    return { delivered: true };
  },
};

export const iScore = {
  async getReport(_nationalId: string) {
    await delay(1100);
    return { score: 720, band: "good" as const };
  },
};