import { prisma } from "../lib/prisma.js";

export const getDb = (tx) => tx || prisma;
