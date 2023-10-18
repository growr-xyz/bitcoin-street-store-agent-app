"use client";
import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
// import { useMerchantById } from "@/lib/services";

interface EditProductPageProps {
  params: {
    merchantId: string;
    productId: string;
  };
}

const EditProductPage: React.FC<EditProductPageProps> = ({ params }) => {
  // const { data: merchant } = useMerchantById(params.merchantId);

  return (
    <PageWrapper>
      <Header
        // title={product ? `Edit ${product.name}` : "Edit product"}
        title={"Edit product"}
        backLink={true}
        backLinkHref={`/merchants/${params.merchantId}`}
      />
      {/* <CreateOrEditProduct productId={params.productId} /> */}
    </PageWrapper>
  );
};

export default EditProductPage;
