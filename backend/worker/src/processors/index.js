import { emailProcessor } from "./emailProcessor.js";
import { reportProcessor } from "./reportProcessor.js";

export const processors = {
  email: emailProcessor,
  report: reportProcessor
};