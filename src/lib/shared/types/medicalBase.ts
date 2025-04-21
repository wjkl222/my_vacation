import { api } from "~/server/api";
import { InferTreatyReturnType } from "./utils";

export type MedicalBase = InferTreatyReturnType<typeof api.medicalBase.index.get>["medicalBase"][number]