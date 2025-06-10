"use client";
import React from "react";
import { SppIndikatorTable } from "../../component/SppIndikatorTable";
import { SppIndikatorWeightForm } from "../../component/SppIndikatorWeightForm";
import { Separator } from "@/components/ui/separator";
import { SppClassConfig } from "../../component/SppClassConfig";
import { SppConfigStatus } from "../../component/SppConfigStatus";

export const SppSettingsContainer:React.FC<{ children?: React.ReactNode, guid?:string}> = (props) => {
  return props.guid && (
    <div className="p-6 w-full h-full flex flex-col gap-4">
      <SppConfigStatus />
      <Separator/>
      <SppIndikatorTable guid={props.guid} />
      <Separator/>
      <SppClassConfig />
      <Separator/>
      <SppIndikatorWeightForm />
    </div>
  );
};
