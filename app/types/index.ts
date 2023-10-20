import { z } from "zod";
import {
  MerchantStatusSchema,
  MerchantsSchema,
  MerchantSchema,
  ProductStatusSchema,
  ProductsSchema,
  ProductSchema,
  StallStatusSchema,
  StallSchema,
  ShippingSchema,
  ShippingZoneSchema,
} from "./schemas";

export type Merchants = z.infer<typeof MerchantsSchema>;
export type MerchantStatus = z.infer<typeof MerchantStatusSchema>;
export type Merchant = z.infer<typeof MerchantSchema>;
export type ShippingZone = z.infer<typeof ShippingZoneSchema>;
export type StallStatus = z.infer<typeof StallStatusSchema>;
export type Stall = z.infer<typeof StallSchema>;
export type Shipping = z.infer<typeof ShippingSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductStatus = z.infer<typeof ProductStatusSchema>;
export type Product = z.infer<typeof ProductSchema>;
