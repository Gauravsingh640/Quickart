import { remember } from "./userMemory.service.js";

export async function extractMemory(userId, message) {
  if (!userId || !message) return;

  console.log("Extracting Memory:", message);

  let match;

  // Name
  match = message.match(/my name is\s+(.+)/i);
  if (match) {
    console.log("Saving Name:", match[1].trim());
    await remember(userId, "name", match[1].trim());
  }

  // Budget
  match = message.match(/my budget is\s+(\d+)/i);
  if (match) {
    console.log("Saving Budget:", match[1]);
    await remember(userId, "budget", match[1]);
  }

  // Favourite Brand
  match = message.match(/my favourite brand is\s+(.+)/i);
  if (match) {
    console.log("Saving Favourite Brand:", match[1].trim());
    await remember(userId, "favoriteBrand", match[1].trim());
  }

  // City
  match = message.match(/i live in\s+(.+)/i);
  if (match) {
    console.log("Saving City:", match[1].trim());
    await remember(userId, "city", match[1].trim());
  }

  // Profession
  match = message.match(/i am an?\s+(.+)/i);
  if (match) {
    console.log("Saving Profession:", match[1].trim());
    await remember(userId, "profession", match[1].trim());
  }
}