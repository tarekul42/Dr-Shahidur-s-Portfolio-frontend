export interface DbChamber {
  _id: string;
  chemberName: string;
}

/** Maps fallback chamber slug to backend MongoDB id from /chambers list. */
export function mapChamberIdToDbId(
  fallbackId: string,
  chambers: DbChamber[],
): string | undefined {
  if (!fallbackId) return undefined;

  const normalizedId = fallbackId.toLowerCase();
  const found = chambers.find((c) => {
    const name = c.chemberName.toLowerCase();
    if (normalizedId === "dhaka") {
      return name.includes("ibn sina");
    }
    if (normalizedId === "singair") {
      return name.includes("singair") || name.includes("সিটি");
    }
    if (normalizedId === "manikganj") {
      return (
        name.includes("manikganj") ||
        name.includes("ইসলামী") ||
        name.includes("islam")
      );
    }
    if (normalizedId === "jhitka") {
      return (
        name.includes("jhitka") ||
        name.includes("পায়রা") ||
        name.includes("payra")
      );
    }
    return false;
  });

  return found?._id;
}
