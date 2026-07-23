export const createPlan = (intent, message) => {
  switch (intent) {
    case "SEARCH_PRODUCT":
      return [
        {
          tool: "SEARCH_PRODUCT",
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
          tool: "SEARCH_PRODUCT",
          input: message,
        },
        {
          tool: "BUY_NOW",
        },
      ];

    case "TRACK_ORDER":
      return [
        {
          tool: "TRACK_ORDER",
        },
      ];

    case "ORDER_HISTORY":
      return [
        {
          tool: "ORDER_HISTORY",
        },
      ];

    case "CANCEL_ORDER":
      return [
        {
          tool: "CANCEL_ORDER",
        },
      ];

    default:
      return [
        {
          tool: "SEARCH_PRODUCT",
          input: message,
        },
      ];
  }
};