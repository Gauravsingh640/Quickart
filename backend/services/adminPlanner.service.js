export const createAdminPlan = (intent, message) => {
  switch (intent) {

    case "GENERAL_CHAT":
      return [
        {
          tool: "GENERAL_CHAT",
          input: message,
        },
      ];

    case "BUSINESS_OVERVIEW":
      return [
        {
          tool: "BUSINESS_OVERVIEW",
          input: message,
        },
      ];

    case "SALES_ANALYTICS":
      return [
        {
          tool: "SALES_ANALYTICS",
          input: message,
        },
      ];

    case "TOP_PRODUCTS":
      return [
        {
          tool: "TOP_PRODUCTS",
          input: message,
        },
      ];

    case "LOW_STOCK":
      return [
        {
          tool: "LOW_STOCK",
          input: message,
        },
      ];

    case "CATEGORY_SALES":
      return [
        {
          tool: "CATEGORY_SALES",
          input: message,
        },
      ];

    case "BUSINESS_INSIGHTS":
      return [
        {
          tool: "BUSINESS_INSIGHTS",
          input: message,
        },
      ];

    default:
      return [
        {
          tool: "GENERAL_CHAT",
          input: message,
        },
      ];
  }
};