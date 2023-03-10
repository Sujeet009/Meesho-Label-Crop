import { Anybody, Inter } from "next/font/google";
import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import HomePage from "@/components/HomePage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {  
  return (
    <>
      <HomePage></HomePage>
    </>
  );
}
