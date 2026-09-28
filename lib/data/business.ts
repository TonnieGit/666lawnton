// Business details aren't in the Wix Stores/CMS APIs we use, so they stay a
// committed JSON file in both modes.
import businessJson from "@/data/mock/business.json";
import type { BusinessInfo } from "./types";

export async function getBusinessInfo(): Promise<BusinessInfo> {
  return businessJson as BusinessInfo;
}
