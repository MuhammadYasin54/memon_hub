import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookie = "memon_admin_session";
const lifetimeSeconds = 60 * 60 * 8;

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function hasAdminConfig() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function checkCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  const same = (a: string, b: string) => {
    const left = createHmac("sha256", "memon-login-check").update(a).digest();
    const right = createHmac("sha256", "memon-login-check").update(b).digest();
    return timingSafeEqual(left, right);
  };
  return hasAdminConfig() && same(username, expectedUser) && same(password, expectedPass);
}

export function createAdminToken() {
  const value = String(Date.now() + lifetimeSeconds * 1000);
  return `${value}.${sign(value)}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token || !hasAdminConfig()) return false;
  const [expiry, signature, extra] = token.split(".");
  if (!expiry || !signature || extra || !/^\d+$/.test(expiry) || Number(expiry) < Date.now()) return false;
  const expected = sign(expiry);
  const providedBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  return providedBytes.length === expectedBytes.length && timingSafeEqual(providedBytes, expectedBytes);
}

export async function isAdmin() {
  return verifyAdminToken((await cookies()).get(adminCookie)?.value);
}
