/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Card } from "@/components/ui/card";
import { CollapsibleCard } from "../../components/CollapsibleCard/CollapsibleCard";
import { SppGeneralInfo } from "../../components/SppGeneralInfo";
import { SppGeneralChart } from "../../components/SppGeneralChart/SppGeneralChart";
import { SppDetailCity } from "../../components/SppDetailCity";
import { useUsersControl } from "@/modules/main-app/hooks/useUsersControl";
import { Info, Loader2 } from "lucide-react";

export const ToolContainer = () => {
  const session = useAuthStore((state) => state.session);
  const userControl = useUsersControl();

  const [isLoading, setIsLoading] = useState(false);

  // Track changes to activeKabkotId and trigger loading state
  useEffect(() => {
    if (userControl.user.activeKabkotId) {
      setIsLoading(true);
      // Simulate a delay for fetching new data (adjust as needed)
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Change this time based on actual API response time
    }
  }, [userControl.user.activeKabkotId]);

  if (!session) {
    return <p>No session available</p>;
  }

  const LoadingComponent = () => {
    return (
      <div className="absolute flex-col inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 gap-4">
        <p className="text-white text-wrap">Updating SPP Data</p>
        <Loader2 className="w-12 h-12 animate-spin text-secondary" />
      </div>
    );
  };

  return (
    <div className="relative flex p-4 bg-gray-100 h-[93vh] flex-col gap-2">
      {isLoading && <LoadingComponent />} 
      {userControl.user.activeKabkotId ? (
        <>
          {/* User Info Card */}
          <div className="w-full flex flex-col gap-2">
            <Card className="p-3 flex justify-between gap-2 items-center w-full">
              <div className="flex flex-col justify-between gap-2 w-full">
                <h1 className="font-bold text-xl">Capaian SPP {userControl.user.activeUsername.split('RP2P ')[1]}</h1>
                <SppGeneralInfo kabkot_id={userControl.user.activeKabkotId} />
              </div>
            </Card>
          </div>

          {/* Data Visualization Section */}
          <div className="w-full flex flex-col gap-2 h-[77vh] overflow-y-auto custom-scrollbar p-2 bg-slate-200 rounded-lg">
            <CollapsibleCard title="Grafik Rekapitulasi Capaian RP2P">
              <SppGeneralChart kabkot_id={userControl.user.activeKabkotId} />
            </CollapsibleCard>
            <div className="w-full h-full">
              <SppDetailCity kabkot_id={userControl.user.activeKabkotId} />
            </div>
          </div>
        </>
      ) : (
        <Card className="bg-[#F2F2F2] text-primary rounded-md shadow-md flex items-center gap-2 px-2 py-4">
          <Info height={20} width={20} />
          <span>Planning Tools tidak tersedia untuk Admin</span>
        </Card>
      )}
    </div>
  );
};
