"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useLandingRedirect() {
  const router = useRouter();

  const redirectToLanding = () => {
    const isMobile = window.innerWidth < 768;
    router.push(isMobile ? "/m" : "/");
  };

  return redirectToLanding;
}