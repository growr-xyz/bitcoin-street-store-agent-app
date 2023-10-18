"use client";

import Loader from "@/components/Loader";
import { useMerchantById, useProducts } from "@/lib/services";
// import { Merchant } from "@/types";
import Link from "next/link";
// import { useState, useEffect } from "react";

interface MerchantDetailsProps {
  merchantId: string;
}

const MerchantDetails: React.FC<MerchantDetailsProps> = ({ merchantId }) => {
  const { data: merchant, isLoading: isMerchantLoading } =
    useMerchantById(merchantId);

  const { data: products, isLoading: isProductsLoading } = useProducts(
    // If we pass empty string here, the query will not be enabled
    merchant?._id || ""
  );

  return (
    <div className="p-6 max-w-xl mx-auto min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-6rem)] flex flex-col justify-between">
      {isMerchantLoading || isProductsLoading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : !merchant ? (
        <div>Merchant not found.</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold py-4">
            Store
            <span className="ml-2 my-auto p-1 rounded bg-stone-600 text-white text-xs font-normal">
              Draft
            </span>
          </h2>

          <div className="flex flex-col space-y-4 w-full">
            {products?.rows?.map((product) => (
              <Link
                key={product._id}
                href={`/merchants/${merchant._id}/products/${product._id}`}
                className="rounded border border-stone-200 p-4 bg-stone-100 cursor-pointer hover:bg-stone-200"
              >
                <div>{product.name}</div>
                <div className="text-sm">{product.price}</div>
              </Link>
            ))}
          </div>
        </>
      )}
      {merchant && (
        <div className="mt-auto my-8 flex justify-center items-center">
          <Link
            className="rounded px-6 py-2 bg-orange-600 text-white text-lg"
            href={`/merchants/${merchant._id}/products/add`}
          >
            Add a product
          </Link>
        </div>
      )}
    </div>
  );
};

export default MerchantDetails;
