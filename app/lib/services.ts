import { useMutation, useQuery } from "@tanstack/react-query";
import { Merchants, Merchant, Products, Product } from "@/types";
import {
  MerchantsSchema,
  MerchantSchema,
  ProductsSchema,
  ProductSchema,
} from "@/types/schemas";
import { api } from "./axios";
import { useState, useEffect } from "react";

export const fetchMerchants = async (): Promise<Merchants> => {
  const { data } = await api.get("/merchants");
  return MerchantsSchema.parse(data);
};

export const useMerchants = () => {
  return useQuery(["merchants"], fetchMerchants, {
    enabled: !!api.defaults.headers.common["Authorization"],
  });
};

// Not implemented yet by the API
// export const fetchMerchantById = async (
//   merchantId: string
// ): Promise<Merchant> => {
//   const { data } = await api.get(`/merchants/${merchantId}`);
//   return MerchantSchema.parse(data);
// };

// export const useMerchantById = (merchantId: string) => {
//   return useQuery(
//     ["merchants", merchantId],
//     () => fetchMerchantById(merchantId),
//     {
//       enabled: !!api.defaults.headers.common["Authorization"],
//     }
//   );
// };

// Temporary implementation
export const useMerchantById = (merchantId?: string) => {
  if (merchantId) {
    const [merchant, setMerchant] = useState<Merchant>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: merchants } = useMerchants();

    // Select merchant object by merchantId
    useEffect(() => {
      if (merchantId && merchants) {
        const merchantFound = merchants.rows?.find(
          (merchant) => merchant._id === merchantId
        );

        if (merchantFound) setMerchant(merchantFound);

        setIsLoading(false);
      }
    }, [merchants, merchantId]);

    return { data: merchant, isLoading };
  } else return { data: undefined, isLoading: false };
};

export const inviteOrEditMerchant = async (
  merchant: Merchant
): Promise<Merchant> => {
  if (merchant._id) {
    const { data } = await api.put(`/merchants/${merchant._id}`, merchant);
    return MerchantSchema.parse(data);
  } else {
    const { data } = await api.post("/merchants", merchant);
    return MerchantSchema.parse(data);
  }
};

export const useInviteOrEditMerchant = () => {
  return useMutation(inviteOrEditMerchant);
};

export const fetchProducts = async (merchantId: string): Promise<Products> => {
  const { data } = await api.get(`/merchants/${merchantId}/products`);
  return ProductsSchema.parse(data);
};

export const useProducts = (merchantId: string) => {
  return useQuery(["products", merchantId], () => fetchProducts(merchantId), {
    enabled: !!api.defaults.headers.common["Authorization"] && !!merchantId,
  });
};

export const editProduct = async (product: Product): Promise<Product> => {
  if (product._id) {
    const { data } = await api.put(
      `/merchants/${product.merchantId}/products/${product._id}`,
      product
    );
    return ProductSchema.parse(data);
  } else {
    const { data } = await api.post(
      `/merchants/${product.merchantId}/products`,
      product
    );
    return ProductSchema.parse(data);
  }
};

export const useEditProduct = () => {
  return useMutation(editProduct);
};
