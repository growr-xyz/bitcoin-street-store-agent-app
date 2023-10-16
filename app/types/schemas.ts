import { z } from "zod";

export const merchantSchema = z.object({
  id: z.string().optional(), // New merchants don't have ID
  name: z.string().min(1, { message: "Name is required" }),
  // TODO: Format validation
  mobileNumber: z.string().min(1, { message: "Mobile number is required" }),
  userName: z.string().min(1, { message: "User name is required" }),
  walletAddress: z.string().min(1, { message: "Wallet address is required" }),
  about: z.string().optional(),
  picture: z.string().optional(),
  status: z.string(), // TODO: enum
  stall: z.object({
    id: z.string().optional(), // New stalls don't have ID
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    currency: z.string().optional(), // sats
    // TODO: Shipping
  }),
});

// {
//   "id": "123a4567-b89c-123d-456e-789f123a4567",
//   "name": "Merchant X",
//   "mobileNumber": "233123456789",
//   "userName": "string",
//   "walletAddress": "TBD",
//   "about": "string",
//   "picture": "URL1",
//   "status": "Draft",
//   "stall": {
//     "id": "string",
//     "name": "string",
//     "description": "string",
//     "currency": "string"
//   }
// }

export const productSchema = z.object({
  id: z.string().optional(), // New products don't have ID
  stallId: z.string().min(1, { message: "Stall is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  images: z.array(z.string()), // TODO: Is array of URLs OK?
  price: z.number().min(0, { message: "Price must be positive" }),
  quantity: z.number().min(0, { message: "Quantity must be positive" }),
});

// {
//   "id": "123a4567-b89c-123d-456e-789f123a4567",
//   "stallId": "string",
//   "name": "Product X",
//   "description": "string",
//   "images": [
//     "URL1",
//     "URL2"
//   ],
//   "price": 3000,
//   "quantity": 10
// }
