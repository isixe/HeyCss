import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const routing = defineRouting({
	locales: LOCALES,
	defaultLocale: DEFAULT_LOCALE,
	localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
