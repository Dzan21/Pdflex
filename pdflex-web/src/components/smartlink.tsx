"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/use-is-mobile";

type Props = {
  href: string; // napr. "/navod"
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function SmartLink({ href, children, className, onClick }: Props) {
  const isMobile = useIsMobile();
  const isDashboardLink = href.startsWith("/dashboard");

  const finalHref = isMobile && !isDashboardLink ? `/m${href}` : href;

  return (
    <Link href={finalHref} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}