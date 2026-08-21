const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const SESSION_COOKIE_NAME = "__Host-admin_session";
const TOTP_PERIOD_SECONDS = 30;
const TOTP_DIGITS = 6;

type AdminSecrets = {
  totp: string;
  session: string;
};

const base64UrlEncode = (value: string) =>
  btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlDecode = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
};

const base32Decode = (value: string) => {
  const normalized = value.toUpperCase().replace(/[\s-]/g, "").replace(/=+$/g, "");
  if (!normalized) return null;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const character of normalized) {
    const index = alphabet.indexOf(character);
    if (index === -1) return null;

    buffer = (buffer << 5) | index;
    bits += 5;

    while (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >>> bits) & 0xff);
    }
  }

  return new Uint8Array(bytes);
};

const importHmacKey = (secret: string, hash: "SHA-1" | "SHA-256") =>
  crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash }, false, ["sign", "verify"]);

const sign = async (value: string, secret: string) => {
  const key = await importHmacKey(secret, "SHA-256");
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
};

const verifySignature = async (value: string, signature: string, secret: string) => {
  try {
    const key = await importHmacKey(secret, "SHA-256");
    const decodedSignature = Uint8Array.from(base64UrlDecode(signature), (character) => character.charCodeAt(0));
    return crypto.subtle.verify("HMAC", key, decodedSignature, new TextEncoder().encode(value));
  } catch {
    return false;
  }
};

const getAdminSecrets = (env: Env): AdminSecrets | null => {
  const totp = env.ADMIN_TOTP_SECRET?.trim();
  const session = env.ADMIN_SESSION_SECRET?.trim();

  if (!totp || !session || session.length < 32) return null;

  return { totp, session };
};

const getCookie = (request: Request, name: string) => {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;

  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) ?? null;
};

const getTotpCode = async (secret: Uint8Array, timestamp: number) => {
  const counter = Math.floor(timestamp / 1000 / TOTP_PERIOD_SECONDS);
  const data = new Uint8Array(8);
  const view = new DataView(data.buffer);
  view.setUint32(4, counter, false);

  const key = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(secret) as Uint8Array<ArrayBuffer>,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3];

  return (binary % 10 ** TOTP_DIGITS).toString().padStart(TOTP_DIGITS, "0");
};

export const verifyTotp = async (code: string, env: Env) => {
  const secrets = getAdminSecrets(env);
  const secret = secrets && base32Decode(secrets.totp);
  const normalizedCode = code.replace(/\s/g, "");

  if (!secret || !/^\d{6}$/.test(normalizedCode)) return false;

  const now = Date.now();
  const codes = await Promise.all([-1, 0, 1].map((offset) => getTotpCode(secret, now + offset * TOTP_PERIOD_SECONDS * 1000)));
  return codes.includes(normalizedCode);
};

export const createAdminSession = async (env: Env) => {
  const secrets = getAdminSecrets(env);
  if (!secrets) throw new Error("Admin authentication secrets are not configured.");

  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(JSON.stringify({ exp: now + SESSION_DURATION_SECONDS, iat: now, nonce: crypto.randomUUID() }));
  const signature = await sign(payload, secrets.session);

  return `${payload}.${signature}`;
};

export const hasAdminSession = async (request: Request, env: Env) => {
  const secrets = getAdminSecrets(env);
  const token = getCookie(request, SESSION_COOKIE_NAME);
  if (!secrets || !token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  if (!(await verifySignature(payload, signature, secrets.session))) return false;

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as { exp?: unknown };
    return typeof session.exp === "number" && Number.isSafeInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

export const getAdminSessionCookie = (session: string) =>
  `${SESSION_COOKIE_NAME}=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`;

export const clearAdminSessionCookie = () =>
  `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;

export const isAdminAuthConfigured = (env: Env) => getAdminSecrets(env) !== null;
