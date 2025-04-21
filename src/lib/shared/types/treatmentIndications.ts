import { InferTreatyReturnType } from "./utils";
import { api } from '~/server/api';

export type TreatmentIndication = InferTreatyReturnType<
    typeof api.treatmentIndications.index.get
>["treatmentIndications"][number]