"use client";

import React, { useState } from "react";
import { SppSettingsContainer } from "../../container/SppSettingsContainer";
import { Separator } from "@/components/ui/separator";

export const SppSettingsLayout:React.FC<{ children?: React.ReactNode, session:any}> = (props) => {
  return (
    <React.Fragment>
      {props.children}
      <SppSettingsContainer guid={props.session.user.geonodeUid} />
    </React.Fragment>
  );
};
