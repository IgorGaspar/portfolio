import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { pt } from "./pt";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
export type { Dictionary };
