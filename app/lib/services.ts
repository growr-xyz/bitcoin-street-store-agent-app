import { useMutation, useQuery } from "@tanstack/react-query";
import { Merchants, Merchant, Products, Product } from "@/types";
import {
  MerchantsSchema,
  MerchantSchema,
  ProductsSchema,
  ProductSchema,
} from "@/types/schemas";
import { api } from "./axios";

export const fetchMerchants = async (): Promise<Merchants> => {
  const { data, status } = await api.get("/merchants");
  if (status === 200) return MerchantsSchema.parse(data);
  else throw new Error(data?.message);
};

export const useMerchants = () => {
  return useQuery(["merchants"], fetchMerchants, {
    enabled: !!api.defaults.headers.common["Authorization"],
  });
};

export const fetchMerchantById = async (
  merchantId: string
): Promise<Merchant> => {
  const { data, status } = await api.get(`/merchants/${merchantId}`);
  if (status === 200) return MerchantSchema.parse(data);
  else throw new Error(data?.message);
};

export const useMerchantById = (merchantId: string) => {
  return useQuery(
    ["merchants", merchantId],
    () => fetchMerchantById(merchantId),
    {
      enabled: !!api.defaults.headers.common["Authorization"] && !!merchantId,
    }
  );
};

export const editMerchant = async (merchant: Merchant): Promise<Merchant> => {
  const merchantPatched: Merchant = {
    ...(merchant._id && { _id: merchant._id }),
    phoneNumber: merchant.phoneNumber,
    username: merchant.username,
    walletAddress: merchant.username,
    name: merchant.name,
    about: merchant.about,
    status: merchant.status,
    createdBy: merchant.createdBy,
    ...(merchant.picture && { picture: merchant.picture }),
    ...(merchant.banner && { picture: merchant.banner }),
    ...(merchant.website && { picture: merchant.website }),
  };
  // console.log("editMerchant", merchantPatched);
  if (merchant._id) {
    const { data, status } = await api.put(
      `/merchants/${merchant._id}`,
      merchantPatched
    );
    if (status === 200) return MerchantSchema.parse(data);
    else throw Error(data?.message);
  } else {
    const { data, status } = await api.post("/merchants", merchantPatched);
    if (status === 200) return MerchantSchema.parse(data);
    else throw Error(data?.message);
  }
};

export const useEditMerchant = () => {
  return useMutation(editMerchant);
};

export const pushMerchantProductForReview = async (merchantId: string) => {
  const { data, status } = await api.post(
    `/merchants/${merchantId}/products/push`
  );
  if (status === 200) return;
  else throw Error(data?.message);
};

export const usePushMerchantProductForReview = () => {
  return useMutation(pushMerchantProductForReview);
};

export const fetchProducts = async (merchantId: string): Promise<Products> => {
  const { data, status } = await api.get(`/merchants/${merchantId}/products`);
  // console.log("fetchProducts", data);
  // console.log("ProductsSchema", ProductsSchema);
  if (status === 200) return ProductsSchema.parse(data);
  else throw new Error(data?.message);
};

export const useProducts = (merchantId: string) => {
  return useQuery(["products", merchantId], () => fetchProducts(merchantId), {
    enabled: !!api.defaults.headers.common["Authorization"] && !!merchantId,
  });
};

export const fetchProductById = async ({
  merchantId,
  productId,
}: {
  merchantId: string;
  productId: string;
}): Promise<Product> => {
  const { data, status } = await api.get(
    `/merchants/${merchantId}/products/${productId}`
  );
  if (status === 200) return ProductSchema.parse(data);
  else throw Error(data?.message);
};

export const useProductById = ({
  merchantId,
  productId,
}: {
  merchantId: string;
  productId: string;
}) => {
  return useQuery(
    ["products", merchantId, productId],
    () => fetchProductById({ merchantId, productId }),
    {
      enabled:
        !!api.defaults.headers.common["Authorization"] &&
        !!merchantId &&
        !!productId,
    }
  );
};

export const editProduct = async (product: Product): Promise<Product> => {
  const productPatched: Product = {
    ...(product._id && { _id: product._id }),
    merchantId: product.merchantId,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    currency: product.currency,
    // TODO: Currently forcing the status to draft, this should be implemented in the BE.
    status: "Draft", // product.status,
    createdBy: product.createdBy,
    images: product.images,
    // specs: product.specs,
    // ...(product.shipping && { images: product.shipping }),
  };
  console.log("editProduct", productPatched);
  if (product._id) {
    const { data, status } = await api.put(
      `/merchants/${product.merchantId}/products/${product._id}`,
      productPatched
    );
    if (status === 200) return ProductSchema.parse(data);
    else throw Error(data?.message);
  } else {
    const { data, status } = await api.post(
      `/merchants/${product.merchantId}/products`,
      productPatched
    );
    if (status === 200) return ProductSchema.parse(data);
    else throw Error(data?.message);
  }
};

export const useEditProduct = () => {
  return useMutation(editProduct);
};
