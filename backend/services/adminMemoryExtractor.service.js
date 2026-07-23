import { remember } from "./adminMemory.service.js";

export async function extractMemory(userId, message) {
  if (!userId || !message) return;

  let match;

  match = message.match(/my name is\s+(.+)/i);
  if (match) {
    await remember(userId, "name", match[1].trim());
  }

  match = message.match(/show reports? in\s+(lakhs|crores|millions)/i);
  if (match) {
    await remember(userId, "reportFormat", match[1].trim());
  }

  match = message.match(/always show\s+(sales|orders|users|products)\s+first/i);
  if (match) {
    await remember(userId, "dashboardPreference", match[1].trim());
  }

  match = message.match(/default period is\s+(daily|weekly|monthly|yearly)/i);
  if (match) {
    await remember(userId, "defaultPeriod", match[1].trim());
  }

  match = message.match(/use currency\s+(.+)/i);
  if (match) {
    await remember(userId, "currency", match[1].trim());
  }
}