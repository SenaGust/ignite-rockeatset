const locale = "en-US" as const;

export const dateFormatter = new Intl.DateTimeFormat(locale);
export const priceFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "USD",
});
