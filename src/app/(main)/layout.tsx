"use client";

import { ModeToggle } from "@/components/theme-provider-button";
import React from "react";
import Provider from "../../../provider";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className=" w-full min-h-screen h-full flex flex-col space-y-1 p-2">
      <div className=" flex px-2">
        <Provider>
          <ModeToggle />
        </Provider>
      </div>
      <div className=" px-2"> {children}</div>
    </div>
  );
}
