"use client";

import Loader from "@/components/Loader";
import { useMerchants } from "@/lib/services";
import Link from "next/link";

const MerchantList: React.FC = () => {
  const { data: merchants, isLoading } = useMerchants();

  return (
    <div className="p-6 max-w-xl mx-auto min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-6rem)] flex flex-col justify-between">
      <h2 className="text-2xl font-bold py-4">Your merchants</h2>
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : merchants?.rows.length === 0 ? (
        <div>You still do not have any merchants.</div>
      ) : (
        <div className="flex flex-col space-y-4 w-full">
          {merchants?.rows.map((merchant) => (
            <Link
              key={merchant._id}
              href={`/merchants/${merchant._id}`}
              className="rounded border border-stone-200 p-4 bg-stone-100 cursor-pointer hover:bg-stone-200"
            >
              <div className="font-bold items-center">
                {merchant.username}
                <span className="ml-2 my-auto p-1 rounded bg-stone-500 text-white text-xs font-normal">
                  {merchant.status}
                </span>
              </div>
              <div className="text-sm">
                {merchant.mobileNumber} &bull; {merchant.walletAddress}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-auto my-8 flex justify-center items-center">
        <Link
          className="rounded px-6 py-2 bg-orange-600 text-white text-lg"
          href="/merchants/invite"
        >
          Invite a merchant
        </Link>
      </div>
    </div>
  );
};

export default MerchantList;
