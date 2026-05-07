export function getCurrentSeason(locale: string): string {
  const month = new Date().getMonth() + 1; // 1-12
  const vi = ["Xuân","Xuân","Xuân","Hè","Hè","Hè","Thu","Thu","Thu","Đông","Đông","Đông"];
  const en = ["Spring","Spring","Spring","Summer","Summer","Summer","Autumn","Autumn","Autumn","Winter","Winter","Winter"];
  return (locale === "vi" ? vi : en)[month - 1] ?? (locale === "vi" ? "Hè" : "Summer");
}

export function getSeasonMenuLabel(locale: string): string {
  const s = getCurrentSeason(locale);
  return locale === "vi" ? `Thực Đơn Mùa ${s}` : `${s} Menu`;
}
