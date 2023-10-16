import { z } from "zod";
import { merchantSchema, productSchema } from "./schemas";

export type Merchant = z.infer<typeof merchantSchema>;
export type Product = z.infer<typeof productSchema>;
