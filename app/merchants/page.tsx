"use client";

import Header from "@/components/Header";
import MerchantList from "../MerchantList";
import PageWrapper from "@/components/PageWrapper";

const MerchantsPage: React.FC = () => {
  return (
    <PageWrapper>
      <Header title="Welcome" />
      <MerchantList />
    </PageWrapper>
  );
};

export default MerchantsPage;
