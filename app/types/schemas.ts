import { z } from "zod";

const DateSchema = z.string().refine((value) => !isNaN(Date.parse(value)), {
  message: "Invalid date format",
});

export const ShippingZoneStatusSchema = z
  .enum(["Draft", "Review", "Active", "Deactivated"])
  .default("Draft");

export const ShippingZoneSchema = z.object({
  _id: z.string().optional(), // New shipping zones don't have _id
  name: z.string().min(1, { message: "Name is required" }),
  cost: z.number().default(0),
  regions: z.array(z.string().default("Worldwide - Online")),
  status: ShippingZoneStatusSchema,
  eventId: z.string().optional(), // Assuming ObjectId is a string; new shipping zones don't have eventId
  createdBy: z.string(), // .default("AGENT NOSTR PUBKEY IMPLEMENT WITH NIP 98"),
  merchantId: z.string(), // Assuming ObjectId is a string
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional(),
  __v: z.number().optional(),
});

// Define the schema for the shipping property
export const ShippingSchema = z.object({
  id: z.string(),
  cost: z.number(),
});

export const ProductStatusSchema = z
  .enum(["Draft", "Review", "Active", "Deactivated"])
  .default("Draft");

// Define the ProductSchema
export const ProductSchema = z.object({
  _id: z.string().optional(), // New products don't have _id
  stallId: z.string().optional(), // Assuming ObjectId is a string, TODO: Remove .optional()
  name: z.string(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  currency: z.string().default("sat"),
  price: z.number().default(0),
  quantity: z.number().default(0),
  specs: z.array(z.string()).optional(),
  shipping: z.array(ShippingSchema).optional(),
  status: ProductStatusSchema,
  eventId: z.string().optional(), // Assuming ObjectId is a string; new products don't have eventId
  createdBy: z.string(),
  merchantId: z.string(), // Assuming ObjectId is a string
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional(),
  __v: z.number().optional(),
});

export const StallStatusSchema = z
  .enum(["Draft", "Review", "Active", "Deactivated"])
  .default("Draft");

export const StallSchema = z.object({
  _id: z.string().optional(), // New stalls don't have _id
  name: z.string(),
  description: z.string().optional(),
  currency: z.string().default("sat"),
  shipping: z.array(ShippingZoneSchema).optional(),
  products: z.array(ProductSchema).optional(),
  regions: z.array(z.string()).optional(),
  status: StallStatusSchema,
  eventId: z.string().optional(), // Assuming ObjectId is a string; new stalls don't have eventId
  createdBy: z.string(),
  merchantId: z.string(), // Assuming ObjectId is a string
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional(),
  __v: z.number().optional(),
});

export const MerchantStatusSchema = z
  .enum(["Invited", "Confirmed", "Active", "Deactivated"])
  .default("Invited");

export const MerchantSchema = z.object({
  _id: z.string().optional(), // New merchants don't have _id
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .refine(
      (value) => {
        // Phone number validation logic
        const phoneNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        return phoneNumberRegex.test(value);
      },
      {
        message: "Invalid phone number",
      }
    ),
  username: z.string().min(1, { message: "User name is required" }),
  walletAddress: z
    .string()
    .min(1, { message: "Merchant wallet's Lightning address is required" }),
  // .email({ message: "Invalid Lightning address" })
  name: z.string().optional(),
  about: z.string().optional(),
  picture: z.string().url().optional(),
  banner: z.string().url().optional(),
  website: z.string().url().optional(),
  stalls: z.array(z.string()).optional(), // Assuming ObjectId is a string
  status: MerchantStatusSchema,
  createdBy: z.string().optional(), // New merchants don't have createdBy, otherwise required
  eventId: z.string().optional(), // Assuming ObjectId is a string; new merchants don't have eventId, otherwise required
  // otp: OtpSchema.optional(),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional(),
  __v: z.number().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().optional(), // Not present if empty rows array
  pageSize: z.number().optional(), // Not present if empty rows array
  total: z.number().optional(), // Not present if empty rows array
  totalPages: z.number().optional(), // Not present if empty rows array
});

// Define a generic function to create the schema
export function createApiResultSchema<T extends z.ZodType<any, any>>(
  rowSchema: T
) {
  return z.object({
    rows: z.array(rowSchema),
    ...PaginationSchema.shape,
  });
}

export const MerchantsSchema = createApiResultSchema(MerchantSchema);
export const ProductsSchema = z.array(ProductSchema); //createApiResultSchema(ProductSchema);
