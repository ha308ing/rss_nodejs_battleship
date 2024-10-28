import { randomUUID } from "node:crypto";

export const generateIndex = () => randomUUID().replace(/-/g, "");
