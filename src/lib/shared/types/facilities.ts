import { api } from "~/server/api";
import { InferTreatyReturnType } from "./utils";

export type Facility = InferTreatyReturnType<typeof api.facilities.index.get>["facilities"][number]