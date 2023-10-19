"use client";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import {
  useMerchantById,
  useProducts,
  usePushMerchantProductForReview,
} from "@/lib/services";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { useContext, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContext } from "@/context/toast-context";

interface MerchantDetailsProps {
  merchantId: string;
}

const MerchantDetails: React.FC<MerchantDetailsProps> = ({ merchantId }) => {
  const { createToast } = useContext(ToastContext);

  const { data: merchant, isLoading: isMerchantLoading } =
    useMerchantById(merchantId);

  const { data: products, isLoading: isProductsLoading } = useProducts(
    // If we pass empty string here, the query will not be enabled
    merchant?._id || ""
  );

  const [draftProducts, setDraftProducts] = useState<number>(0);

  useEffect(() => {
    if (products)
      setDraftProducts(
        products.filter((product) => product.status === "Draft")?.length || 0
      );
  }, [products]);

  const pushMutation = usePushMerchantProductForReview();
  const queryClient = useQueryClient();

  return (
    <Container className="p-4 sm:p-6 max-w-xl mx-auto" fullHeight>
      {isMerchantLoading || isProductsLoading ? (
        <Container className="items-center">
          <Loader />
        </Container>
      ) : !merchant ? (
        <div>Merchant not found.</div>
      ) : (
        <>
          <Container className="items-end">
            <Button href={`/merchants/${merchantId}/edit`}>
              Edit merchant
            </Button>
          </Container>
          <Container className="flex-row justify-start items-center">
            <h2 className="text-2xl font-bold py-4">Store</h2>
            <div
              className={twJoin(
                "ml-2 my-auto p-1 rounded text-white text-xs font-normal",
                draftProducts > 0 ? "bg-yellow-500" : "bg-green-500"
              )}
            >
              {draftProducts > 0
                ? `${draftProducts} product${
                    draftProducts > 1 ? "s" : ""
                  } for review`
                : "Up to date"}
            </div>
          </Container>

          <div className="flex flex-col space-y-4 w-full">
            {(!products || products.length === 0) && (
              <div>No products yet.</div>
            )}
            {products?.map((product) => (
              <Card
                key={product._id}
                href={`/merchants/${merchant._id}/products/${product._id}`}
                title={product.name}
                subtitle={
                  product.price +
                  " " +
                  product.currency +
                  " (" +
                  product.quantity +
                  " pcs available)"
                }
                pillLabel={product.status}
                pillColor={
                  product.status === "Draft"
                    ? "bg-stone-500"
                    : product.status === "Review"
                    ? "bg-yellow-500"
                    : product.status === "Active"
                    ? "bg-green-500"
                    : "bg-stone-300"
                }
              />
            ))}
          </div>
        </>
      )}
      {merchant && (
        <Container
          alignBottom
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl"
        >
          <div className="flex flex-row gap-4 w-full overflow-x-scroll overflow-y-hidden">
            <Button
              className="flex-grow sm:flex-auto"
              href={`/merchants/${merchant._id}/products/add`}
            >
              Add a product
            </Button>
            {draftProducts > 0 && (
              <Button
                className="flex-grow sm:flex-auto"
                onClick={() =>
                  pushMutation.mutate(merchantId, {
                    onSuccess: () => {
                      queryClient.invalidateQueries(["merchants", merchantId]);
                      queryClient.invalidateQueries(["products", merchantId]);
                      createToast({
                        message: "Products were sent for review",
                        type: "success",
                      });
                    },
                    onError: (error) => {
                      console.error(error);
                      createToast({
                        message: "Error sending products for review",
                        type: "error",
                      });
                    },
                  })
                }
              >
                Send {draftProducts} product{draftProducts > 1 ? "s" : ""} for
                review
              </Button>
            )}
          </div>
        </Container>
      )}
    </Container>
  );
};

export default MerchantDetails;
