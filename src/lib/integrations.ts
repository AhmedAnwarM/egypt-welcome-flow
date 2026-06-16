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

// ----- Retail Lending (simulated) -----

export type LendingProduct = "credit_card" | "personal_loan" | "auto_loan" | "mortgage";
export type LendingChannel = "digital" | "branch" | "rm";
export type LendingCustomerType = "etb" | "ntb";

export type LendingDecision =
  | "instant_pre_approval"
  | "conditional_approval"
  | "refer_credit_risk"
  | "outright_reject";

export type LendingScreening = {
  amlHit: boolean;
  pep: boolean;
  sanctions: boolean;
  fraud: boolean;
  iScore: number;
  iScoreBand: "poor" | "fair" | "good" | "very_good" | "excellent";
};

// Annual interest rates for the simulated product matrix.
export const LENDING_RATES: Record<LendingProduct, number> = {
  credit_card: 0.30,   // effective annual for revolving balance
  personal_loan: 0.235,
  auto_loan: 0.165,
  mortgage: 0.135,
};

// Simple monthly installment using flat amortization (M = P * r / (1 - (1+r)^-n)).
export function estimateInstallment(product: LendingProduct, amount: number, tenorMonths: number) {
  if (!amount || !tenorMonths) return 0;
  if (product === "credit_card") {
    // For a credit card the "obligation" is a minimum monthly commitment — 5% of limit.
    return Math.round(amount * 0.05);
  }
  const r = LENDING_RATES[product] / 12;
  if (r === 0) return Math.round(amount / tenorMonths);
  const m = (amount * r) / (1 - Math.pow(1 + r, -tenorMonths));
  return Math.round(m);
}

export function dbrRatio(existingObligations: number, newInstallment: number, netIncome: number) {
  if (!netIncome) return 1;
  return (existingObligations + newInstallment) / netIncome;
}

function bandFor(score: number): LendingScreening["iScoreBand"] {
  if (score >= 780) return "excellent";
  if (score >= 720) return "very_good";
  if (score >= 650) return "good";
  if (score >= 580) return "fair";
  return "poor";
}

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const lending = {
  async runScreening(input: { nationalId: string; fullName: string }): Promise<LendingScreening> {
    auditLog("lending.screening.start");
    await delay(1400);
    // Deterministic mock keyed on national ID so the same applicant returns the same outcome.
    const seed = hashSeed(input.nationalId || input.fullName || "anon");
    const score = 560 + (seed % 280); // 560..839
    const amlHit = seed % 97 === 0; // ~1%
    const pep = seed % 53 === 0;
    const sanctions = seed % 211 === 0;
    const fraud = seed % 89 === 0;
    const result: LendingScreening = {
      amlHit,
      pep,
      sanctions,
      fraud,
      iScore: score,
      iScoreBand: bandFor(score),
    };
    auditLog("lending.screening.done", { ...result });
    return result;
  },

  decide(input: {
    screening: LendingScreening;
    dbr: number;
  }): { decision: LendingDecision; reason: string } {
    const { screening, dbr } = input;
    if (screening.amlHit || screening.sanctions || screening.fraud) {
      return { decision: "outright_reject", reason: "Compliance / fraud screening hit." };
    }
    if (screening.iScore < 580) {
      return { decision: "outright_reject", reason: "Credit bureau score below minimum." };
    }
    if (screening.iScore < 650) {
      return { decision: "refer_credit_risk", reason: "Credit bureau score requires manual review." };
    }
    if (dbr <= 0.5 && screening.iScore >= 680) {
      return { decision: "instant_pre_approval", reason: "Strong score and affordability within policy." };
    }
    if (dbr > 0.5 && screening.iScore >= 650) {
      return { decision: "conditional_approval", reason: "Affordability exceeds 50% DBR — alternatives proposed." };
    }
    return { decision: "refer_credit_risk", reason: "Borderline profile — manual underwriting required." };
  },

  /**
   * Build 2-3 alternative offers that bring DBR within policy by lowering
   * the requested amount, stretching the tenor, or both.
   */
  generateAlternatives(input: {
    product: LendingProduct;
    amount: number;
    tenorMonths: number;
    existingObligations: number;
    netIncome: number;
    maxDbr?: number;
  }) {
    const maxDbr = input.maxDbr ?? 0.5;
    const headroom = Math.max(0, maxDbr * input.netIncome - input.existingObligations);
    const isCard = input.product === "credit_card";

    const longerTenor = isCard ? input.tenorMonths : Math.min(input.tenorMonths + 24, 84);
    const longerTenorAlt = {
      label: "Longer tenor",
      amount: input.amount,
      tenorMonths: longerTenor,
    };

    // Lower amount so the installment fits the DBR headroom.
    let lowerAmount = input.amount;
    if (headroom > 0) {
      if (isCard) {
        lowerAmount = Math.max(5000, Math.floor((headroom / 0.05) / 1000) * 1000);
      } else {
        const r = LENDING_RATES[input.product] / 12;
        const factor = (1 - Math.pow(1 + r, -input.tenorMonths)) / r;
        lowerAmount = Math.max(5000, Math.floor((headroom * factor) / 1000) * 1000);
      }
    } else {
      lowerAmount = Math.max(5000, Math.floor(input.amount * 0.6 / 1000) * 1000);
    }
    const lowerAmountAlt = { label: "Lower amount", amount: lowerAmount, tenorMonths: input.tenorMonths };

    const combinedAlt = {
      label: "Lower amount + longer tenor",
      amount: Math.max(5000, Math.floor(((lowerAmount + input.amount) / 2) / 1000) * 1000),
      tenorMonths: longerTenor,
    };

    const opts = [longerTenorAlt, lowerAmountAlt, combinedAlt];
    return opts.map((o) => {
      const installment = estimateInstallment(input.product, o.amount, o.tenorMonths);
      return {
        ...o,
        installment,
        dbr: dbrRatio(input.existingObligations, installment, input.netIncome),
      };
    });
  },

  // Mocked ETB (existing-to-bank) prefilled customer record.
  async fetchEtbProfile(_nationalId: string) {
    await delay(700);
    return {
      fullName: "Sara Hossam El-Din",
      nationalId: "28906151234567",
      mobile: "+20 100 555 0142",
      email: "sara.hossam@example.eg",
      employer: "Sumerge Egypt S.A.E.",
      employmentType: "permanent",
      sector: "Technology",
      netMonthlyIncome: 45000,
      existingObligations: 4200,
    };
  },

  generateLendingRef() {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `LN-${new Date().getFullYear()}-${n}`;
  },
};