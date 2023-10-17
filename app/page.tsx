"use client";

import { useContext } from "react";
import Header from "@/components/Header";
import { UserContext } from "./context/user-context";
import { useMerchants } from "./lib/services";

const Landing: React.FC = () => {
  const { isAuthenticated } = useContext(UserContext);

  const { data: merchants, isLoading } = useMerchants();

  return (
    <div>
      {isAuthenticated ? (
        <Header title="Welcome!" />
      ) : (
        <Header title="Bitcoin Street Store" />
      )}

      {isAuthenticated && (
        <div className="p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold py-4">Your merchants</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : merchants?.length === 0 ? (
            <div>You still do not have any merchants.</div>
          ) : (
            <div className="flex flex-col space-y-4 w-full">
              {merchants?.map((merchant) => (
                <div
                  key={merchant.id}
                  className="rounded border border-stone-200 p-4 bg-stone-100"
                >
                  <div>{merchant.name}</div>
                  <div className="text-sm">{merchant.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Landing;
