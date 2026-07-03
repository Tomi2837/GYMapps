import { getRows } from "@/infrastructure/sheets/store";

function sameCalendarDay(value: unknown, target: Date) {
  const parsed = new Date(String(value ?? ""));
  if (Number.isNaN(parsed.getTime())) return false;
  return (
    parsed.getFullYear() === target.getFullYear() &&
    parsed.getMonth() === target.getMonth() &&
    parsed.getDate() === target.getDate()
  );
}

function parseAmount(value: unknown) {
  const normalized = String(value ?? "0")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export async function getDashboardData(gymId: string) {
  const [gyms, members, payments, checkins] = await Promise.all([
    getRows("GIMNASIOS"),
    getRows("SOCIOS"),
    getRows("PAGOS"),
    getRows("INGRESOS"),
  ]);

  const now = new Date();
  const gymRow = gyms.find((row) => String(row[0] ?? "") === gymId);
  const gymMembers = members.filter((row) => String(row[1] ?? "") === gymId);
  const gymPayments = payments.filter((row) => String(row[1] ?? "") === gymId);
  const gymCheckins = checkins.filter((row) => String(row[1] ?? "") === gymId);

  const activeMembers = gymMembers.filter((row) => String(row[7] ?? "") === "active").length;
  const expiredMembers = gymMembers.filter((row) => {
    const expiration = new Date(String(row[10] ?? ""));
    return !Number.isNaN(expiration.getTime()) && expiration.getTime() < now.getTime();
  }).length;
  const todayCheckins = gymCheckins.filter((row) => sameCalendarDay(row[4], now)).length;
  const todayRevenue = gymPayments
    .filter((row) => sameCalendarDay(row[5], now))
    .reduce((total, row) => total + parseAmount(row[6]), 0);
  const newMembersThisMonth = gymMembers.filter((row) => {
    const date = new Date(String(row[9] ?? ""));
    return !Number.isNaN(date.getTime()) && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;

  return {
    gym: {
      id: gymId,
      name: String(gymRow?.[1] ?? "GYM Control"),
      address: String(gymRow?.[2] ?? ""),
      primaryColor: String(gymRow?.[5] ?? "#b8ff39"),
      secondaryColor: String(gymRow?.[6] ?? "#111827"),
      backgroundColor: String(gymRow?.[7] ?? "#f5f7fb"),
    },
    stats: {
      activeMembers,
      todayCheckins,
      expiredMembers,
      todayRevenue,
      newMembersThisMonth,
    },
  };
}
