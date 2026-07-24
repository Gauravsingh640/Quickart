export const createPlan = (intent, message) => {
  switch (intent) {
    case "GENERAL_CHAT":
      return [
        {
          tool: "GENERAL_CHAT",
          input: message,
        },
      ];

    case "SEARCH_PRODUCT":
      return [
        {
          tool: "SEARCH_PRODUCT",
          input: message,
        },
      ];

    case "PRODUCT_DETAILS":
      return [
        {
          tool: "PRODUCT_DETAILS",
          input: message,
        },
      ];

    case "COMPARE":
      return [
        {
          tool: "COMPARE",
          input: message,
        },
      ];

    case "BUY_NOW":
      return [
        {
          tool: "BUY_NOW",
          input: message,
        },
      ];

    case "TRACK_ORDER":
      return [
        {
          tool: "TRACK_ORDER",
          input: message,
        },
      ];

    case "ORDER_HISTORY":
      return [
        {
          tool: "ORDER_HISTORY",
          input: message,
        },
      ];

    case "CANCEL_ORDER":
      return [
        {
          tool: "CANCEL_ORDER",
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