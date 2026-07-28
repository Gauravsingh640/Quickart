// services/adminMemoryExtractor.service.js

import { remember } from "./adminMemory.service.js";

// ==========================================
// NORMALIZERS
// ==========================================

const normalizeName = (value) => {
  if (!value) {
    return null;
  }

  const cleaned = value
    .trim()
    .replace(/[.!?]+$/, "")
    .trim();

  if (!cleaned || cleaned.length > 60) {
    return null;
  }

  return cleaned;
};

const normalizeReportFormat = (value) => {
  if (!value) {
    return null;
  }

  const format = value.trim().toLowerCase();

  const allowedFormats = {
    lakh: "lakhs",
    lakhs: "lakhs",

    crore: "crores",
    crores: "crores",

    million: "millions",
    millions: "millions",
  };

  return allowedFormats[format] || null;
};

const normalizeDashboardPreference = (value) => {
  if (!value) {
    return null;
  }

  const preference = value.trim().toLowerCase();

  const allowedPreferences = {
    sale: "sales",
    sales: "sales",

    revenue: "revenue",

    order: "orders",
    orders: "orders",

    user: "users",
    users: "users",

    product: "products",
    products: "products",
  };

  return allowedPreferences[preference] || null;
};

const normalizePeriod = (value) => {
  if (!value) {
    return null;
  }

  const period = value.trim().toLowerCase();

  const allowedPeriods = {
    daily: "daily",
    day: "daily",

    weekly: "weekly",
    week: "weekly",

    monthly: "monthly",
    month: "monthly",

    yearly: "yearly",
    annual: "yearly",
    annually: "yearly",
    year: "yearly",
  };

  return allowedPeriods[period] || null;
};

const normalizeCurrency = (value) => {
  if (!value) {
    return null;
  }

  const currency = value
    .trim()
    .replace(/[.!?]+$/, "")
    .toLowerCase();

  const allowedCurrencies = {
    inr: "INR",
    rupee: "INR",
    rupees: "INR",
    "indian rupee": "INR",
    "indian rupees": "INR",
    "₹": "INR",

    usd: "USD",
    dollar: "USD",
    dollars: "USD",
    "us dollar": "USD",
    "us dollars": "USD",
    $: "USD",

    eur: "EUR",
    euro: "EUR",
    euros: "EUR",
    "€": "EUR",

    gbp: "GBP",
    pound: "GBP",
    pounds: "GBP",
    "british pound": "GBP",
    "british pounds": "GBP",
    "£": "GBP",
  };

  return allowedCurrencies[currency] || null;
};

// ==========================================
// EXTRACT ADMIN MEMORY
// ==========================================

export const extractMemory = async (userId, message) => {
  try {
    // ========================================
    // VALIDATION
    // ========================================

    if (!userId || typeof message !== "string" || !message.trim()) {
      return {};
    }

    const text = message.trim();

    const extracted = {};

    const saveOperations = [];

    // ========================================
    // 1. ADMIN NAME
    // ========================================

    const namePatterns = [
      /\bmy name is\s+([a-z][a-z\s.'-]{0,59})$/i,

      /\bcall me\s+([a-z][a-z\s.'-]{0,59})$/i,

      /\bi am\s+([a-z][a-z\s.'-]{0,59})$/i,

      /\bi'm\s+([a-z][a-z\s.'-]{0,59})$/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);

      if (match) {
        const name = normalizeName(match[1]);

        if (name) {
          extracted.name = name;

          saveOperations.push(remember(userId, "name", name));
        }

        break;
      }
    }

    // ========================================
    // 2. REPORT FORMAT
    // ========================================

    const reportFormatPatterns = [
      /\bshow (?:my )?reports? in\s+(lakh|lakhs|crore|crores|million|millions)\b/i,

      /\bformat (?:my )?reports? in\s+(lakh|lakhs|crore|crores|million|millions)\b/i,

      /\buse\s+(lakh|lakhs|crore|crores|million|millions)\s+(?:for|in)\s+(?:my )?reports?\b/i,

      /\bdisplay (?:numbers|reports?|revenue|sales) in\s+(lakh|lakhs|crore|crores|million|millions)\b/i,
    ];

    for (const pattern of reportFormatPatterns) {
      const match = text.match(pattern);

      if (match) {
        const reportFormat = normalizeReportFormat(match[1]);

        if (reportFormat) {
          extracted.reportFormat = reportFormat;

          saveOperations.push(remember(userId, "reportFormat", reportFormat));
        }

        break;
      }
    }

    // ========================================
    // 3. DASHBOARD PREFERENCE
    // ========================================

    const dashboardPatterns = [
      /\balways show\s+(sales|revenue|orders|users|products)\s+first\b/i,

      /\bprioritize\s+(sales|revenue|orders|users|products)\b/i,

      /\bshow\s+(sales|revenue|orders|users|products)\s+first by default\b/i,
    ];

    for (const pattern of dashboardPatterns) {
      const match = text.match(pattern);

      if (match) {
        const dashboardPreference = normalizeDashboardPreference(match[1]);

        if (dashboardPreference) {
          extracted.dashboardPreference = dashboardPreference;

          saveOperations.push(
            remember(userId, "dashboardPreference", dashboardPreference),
          );
        }

        break;
      }
    }

    // ========================================
    // 4. DEFAULT PERIOD
    // ========================================

    const periodPatterns = [
      /\bdefault period is\s+(daily|day|weekly|week|monthly|month|yearly|annual|annually|year)\b/i,

      /\buse\s+(daily|weekly|monthly|yearly)\s+reports? by default\b/i,

      /\bdefault to\s+(daily|weekly|monthly|yearly)\s+(?:reports?|sales|analytics)\b/i,
    ];

    for (const pattern of periodPatterns) {
      const match = text.match(pattern);

      if (match) {
        const defaultPeriod = normalizePeriod(match[1]);

        if (defaultPeriod) {
          extracted.defaultPeriod = defaultPeriod;

          saveOperations.push(remember(userId, "defaultPeriod", defaultPeriod));
        }

        break;
      }
    }

    // ==========================================
    // REPORT PREFERENCE
    // ==========================================

    const reportPreferencePatterns = [
      /\bremember that i prefer (detailed|summary|brief) reports?\b/i,

      /\bi prefer (detailed|summary|brief) reports?\b/i,

      /\buse (detailed|summary|brief) reports? by default\b/i,
    ];

    for (const pattern of reportPreferencePatterns) {
      const match = text.match(pattern);

      if (match) {
        const preference = match[1].toLowerCase();

        extracted.reportPreference = preference;

        saveOperations.push(remember(userId, "reportPreference", preference));

        break;
      }
    }

    // ========================================
    // 5. CURRENCY
    // ========================================

    const currencyPatterns = [
      /\buse currency\s+(INR|USD|EUR|GBP|rupees?|dollars?|euros?|pounds?)\b/i,

      /\buse\s+(INR|USD|EUR|GBP|rupees?|dollars?|euros?|pounds?)\s+(?:as )?(?:my )?(?:default )?currency\b/i,

      /\bshow (?:prices|revenue|sales|amounts|money) in\s+(INR|USD|EUR|GBP|rupees?|dollars?|euros?|pounds?)\b/i,

      /\bdefault currency is\s+(INR|USD|EUR|GBP|rupees?|dollars?|euros?|pounds?)\b/i,
    ];

    for (const pattern of currencyPatterns) {
      const match = text.match(pattern);

      if (match) {
        const currency = normalizeCurrency(match[1]);

        if (currency) {
          extracted.currency = currency;

          saveOperations.push(remember(userId, "currency", currency));
        }

        break;
      }
    }

    // ========================================
    // 6. SAVE ALL EXTRACTED MEMORIES
    // ========================================

    if (saveOperations.length > 0) {
      await Promise.all(saveOperations);

      console.log("Admin Memories Extracted:", extracted);
    }

    // ========================================
    // 7. RETURN EXTRACTED MEMORY
    // ========================================

    return extracted;
  } catch (error) {
    console.error("Admin Memory Extractor Error:", error);

    throw error;
  }
};
