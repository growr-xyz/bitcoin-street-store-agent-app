"use client";
import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
// import { useMerchantById } from "@/lib/services";

interface EditProductPageProps {
  params: {
    merchantId: string;
  };
}

const EditProductPage: React.FC<EditProductPageProps> = ({ params }) => {
  // const { data: merchant } = useMerchantById(params.merchantId);

  return (
    <PageWrapper>
      <Header
        title="Add a new product"
        backLink={true}
        backLinkHref={`/merchants/${params.merchantId}`}
      />
      {/* <CreateOrEditProduct productId={params.productId} /> */}
    </PageWrapper>
  );
};

export default EditProductPage;
