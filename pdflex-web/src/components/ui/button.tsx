"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

/** cn helper (bez závislosti na tvojom utils) */
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

/* ========================= Variants ========================= */
const buttonVariants = cva(
  [
    // layout
    "relative inline-flex items-center justify-center",
    "whitespace-nowrap select-none",
    "rounded-lg font-medium",
    "transition-all duration-200",
    // focus / accessibility
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "ring-offset-transparent focus-visible:ring-[var(--brand-500)]",
    // disabled
    "disabled:opacity-60 disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "text-white",
          "shadow-md dark:shadow-none",
          // gradient + jemný hover
          "bg-[var(--brand-500)]",
          "hover:brightness-105",
        ].join(" "),
        ghost: [
          "text-[var(--fg)]",
          "border border-[var(--card-border)]",
          "bg-transparent",
          "hover:bg-black/5 dark:hover:bg-white/5",
        ].join(" "),
        subtle: [
          "text-[var(--fg)]",
          "bg-[color-mix(in_srgb,var(--brand-500)_10%,transparent)]",
          "hover:bg-[color-mix(in_srgb,var(--brand-500)_16%,transparent)]",
          "border border-[var(--card-border)]",
        ].join(" "),
        destructive: "bg-rose-600 text-white hover:brightness-105",
        link: "bg-transparent text-[var(--brand-500)] hover:opacity-80 underline underline-offset-4",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-base",
      },
      pill: {
        true: "rounded-full",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      pill: false,
      fullWidth: false,
    },
  }
);

/* ========================= Spinner ========================= */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin text-white/90 dark:text-white", className)}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      role="img"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

/* ========================= Props ========================= */
type BaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Odkaz – keď zadáš href, vyrenderuje sa <Link>. */
    href?: string;
    /** Ikona vľavo od textu. */
    leftIcon?: React.ReactNode;
    /** Ikona vpravo od textu. */
    rightIcon?: React.ReactNode;
    /** Loading stav – zablokuje klik a ukáže spinner. */
    loading?: boolean;
  };

/* ========================= Component ========================= */
export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BaseProps
>(function Button(
  {
    className,
    variant,
    size,
    pill,
    fullWidth,
    leftIcon,
    rightIcon,
    loading = false,
    href,
    children,
    ...rest
  },
  ref
) {
  const classes = cn(
    buttonVariants({ variant, size, pill, fullWidth }),
    className
  );

  const content = (
    <>
      {/* center overlay pre spinner */}
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
        </span>
      )}

      {/* skutočný obsah – pri loadingu znížime opacity, aby bol spinner presne v strede */}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={loading ? "true" : undefined}
        onClick={(e) => {
          if (loading) e.preventDefault();
          (rest.onClick as any)?.(e);
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {content}
    </button>
  );
});

export { buttonVariants };