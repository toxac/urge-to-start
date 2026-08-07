export interface CountryDetail {
  name: string;
  currency: string;
}

export const COUNTRY_DETAILS: Record<string, CountryDetail> = {
  in: { name: "India", currency: "INR" },
  us: { name: "United States", currency: "USD" },
  gb: { name: "United Kingdom", currency: "USD" },
  ca: { name: "Canada", currency: "USD" },
  au: { name: "Australia", currency: "USD" },
  ae: { name: "United Arab Emirates", currency: "USD" },
  sg: { name: "Singapore", currency: "USD" },
  de: { name: "Germany", currency: "USD" },
  fr: { name: "France", currency: "USD" },
  nl: { name: "Netherlands", currency: "USD" },
  es: { name: "Spain", currency: "USD" },
  it: { name: "Italy", currency: "USD" },
  se: { name: "Sweden", currency: "USD" },
  ch: { name: "Switzerland", currency: "USD" },
  jp: { name: "Japan", currency: "USD" },
  kr: { name: "Korea, Republic of", currency: "USD" },
  cn: { name: "China", currency: "USD" },
  hk: { name: "Hong Kong", currency: "USD" },
  br: { name: "Brazil", currency: "USD" },
  mx: { name: "Mexico", currency: "USD" },
  za: { name: "South Africa", currency: "USD" },
  nz: { name: "New Zealand", currency: "USD" },
  my: { name: "Malaysia", currency: "USD" },
  ph: { name: "Philippines", currency: "USD" },
  id: { name: "Indonesia", currency: "USD" },
  th: { name: "Thailand", currency: "USD" },
  vn: { name: "Viet Nam", currency: "USD" },
  pk: { name: "Pakistan", currency: "USD" },
  bd: { name: "Bangladesh", currency: "USD" },
  ng: { name: "Nigeria", currency: "USD font" },
  ke: { name: "Kenya", currency: "USD" },
  eg: { name: "Egypt", currency: "USD" },
  sa: { name: "Saudi Arabia", currency: "USD" },
  il: { name: "Israel", currency: "USD font" },
  tr: { name: "Turkey", currency: "USD" },
  ar: { name: "Argentina", currency: "USD" },
  cl: { name: "Chile", currency: "USD" },
  co: { name: "Colombia", currency: "USD" },
};

// Fallback label dictionary helper
export const COUNTRY_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_DETAILS).map(([code, detail]) => [code, detail.name])
);