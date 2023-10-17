// import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Merchant, Product } from "@/types";
import { merchantSchema, productSchema } from "@/types/schemas";
import { api } from "./axios";
import { z } from "zod";

// function generateUUID(): string {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     var r = (Math.random() * 16) | 0,
//       v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

export const fetchMerchants = async (): Promise<Merchant[]> => {
  const { data } = await api.get("/merchants");

  return z.array(merchantSchema).parse(data);
};

export const useMerchants = () => {
  return useQuery(["merchants"], fetchMerchants, {
    enabled: !!api.defaults.headers.common["Authorization"],
  });
};

export const inviteMerchant = async (merchant: Merchant): Promise<Merchant> => {
  const { data } = await api.post("/merchants", merchant);

  return merchantSchema.parse(data);
};

export const useInviteMerchant = () => {
  return useMutation(inviteMerchant);
};

export const fetchProducts = async (merchantId: string): Promise<Product[]> => {
  const { data } = await api.get(`/merchants/${merchantId}/products`);
  return z.array(productSchema).parse(data);
};

export const useProducts = (merchantId: string) => {
  return useQuery(["products", merchantId], () => fetchProducts(merchantId), {
    enabled: !!api.defaults.headers.common["Authorization"],
  });
};

export const saveProduct = async (product: Product): Promise<Product> => {
  if (product.id) {
    const { data } = await api.put(`/products/${product.id}`, product);
    return productSchema.parse(data);
  } else {
    const { data } = await api.post("/products", product);
    return productSchema.parse(data);
  }
};

export const useSaveProduct = () => {
  return useMutation(saveProduct);
};
