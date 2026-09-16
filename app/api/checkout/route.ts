/**
 * Mock payment session. Nothing is charged here.
 *
 * A real integration replaces this file with a server side call to the provider,
 * for example a Stripe PaymentIntent or a Klarna session created with a secret key
 * that never reaches the browser. Two things survive that rewrite: the amount is
 * always recomputed on the server from the catalogue and the region, never taken
 * from the client, and the client is only ever told which session to continue with,
 * never how much it is worth.
 */

import { NextResponse } from "next/server";

import { PRODUCTS, type Product } from "@/config/products";
import {
  PAYMENT_METHODS,
  REGIONS,
  REGION_ORDER,
  type CurrencyCode,
  type PaymentMethodId,
  type RegionCode,
} from "@/config/site";
import { estimateOrder, orderReference, type OrderLine } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MAX_LINES = 20;
const MAX_QUANTITY_PER_LINE = 10;
const SESSION_TTL_SECONDS = 900;
const ALLOWED_METHODS = ["POST"];

const PRODUCTS_BY_ID = new Map<string, Product>(
  PRODUCTS.map((product) => [product.id, product]),
);

interface CheckoutIntent {
  lines: OrderLine[];
  region: RegionCode;
  method: PaymentMethodId;
  /** Stable fingerprint of the basket, the only input to the reference. */
  signature: string;
}

interface CheckoutPayload {
  sessionId: string;
  reference: string;
  method: PaymentMethodId;
  currency: CurrencyCode;
  amount: number;
  breakdown: {
    subtotal: number;
    shipping: number;
    clearance: number;
    vatIncluded: number;
    total: number;
  };
  redirectUrl: string;
  expiresInSeconds: number;
  live: false;
}

interface FieldError {
  field: string;
  error: string;
}

interface MethodNotAllowed {
  error: string;
  allow: string[];
}

type Validated<T> = { ok: true; value: T } | { ok: false; problem: FieldError };

function fail(field: string, error: string): { ok: false; problem: FieldError } {
  return { ok: false, problem: { field, error } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRegionCode(value: string): value is RegionCode {
  return REGION_ORDER.some((code) => code === value);
}

function isPaymentMethodId(value: string): value is PaymentMethodId {
  return Object.hasOwn(PAYMENT_METHODS, value);
}

/** 128 bits from the platform CSPRNG, base36, for the session identifier. */
function randomToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** FNV-1a over the basket fingerprint. Deterministic, so the reference survives a retry. */
function hashSignature(signature: string): number {
  let hash = 2166136261;
  for (let index = 0; index < signature.length; index += 1) {
    hash ^= signature.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function validate(body: unknown): Validated<CheckoutIntent> {
  if (!isRecord(body)) {
    return fail("body", "Der Anfragekörper muss ein JSON-Objekt sein.");
  }

  const rawItems: unknown = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return fail("items", "Das Feld items muss ein Array mit mindestens einer Position sein.");
  }
  if (rawItems.length > MAX_LINES) {
    return fail("items", `Das Feld items darf höchstens ${MAX_LINES} Positionen enthalten.`);
  }

  const lines: OrderLine[] = [];
  const signatureParts: string[] = [];

  for (let index = 0; index < rawItems.length; index += 1) {
    const entry: unknown = rawItems[index];
    const at = `items[${index}]`;

    if (!isRecord(entry)) {
      return fail(at, `Das Feld ${at} muss ein Objekt mit productId und quantity sein.`);
    }

    const productId: unknown = entry.productId;
    if (typeof productId !== "string" || productId.length === 0) {
      return fail(`${at}.productId`, `Das Feld ${at}.productId muss eine Produkt-ID sein.`);
    }

    const product = PRODUCTS_BY_ID.get(productId);
    if (!product) {
      return fail(
        `${at}.productId`,
        `Das Feld ${at}.productId verweist auf kein Produkt aus dem Katalog.`,
      );
    }

    const quantity: unknown = entry.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY_PER_LINE
    ) {
      return fail(
        `${at}.quantity`,
        `Das Feld ${at}.quantity muss eine ganze Zahl zwischen 1 und ${MAX_QUANTITY_PER_LINE} sein.`,
      );
    }

    lines.push({ product, quantity });
    signatureParts.push(`${product.id}:${quantity}`);
  }

  const region: unknown = body.region;
  if (typeof region !== "string" || !isRegionCode(region)) {
    return fail("region", "Das Feld region muss DE, AT oder CH lauten.");
  }

  const method: unknown = body.method;
  if (typeof method !== "string" || !isPaymentMethodId(method)) {
    return fail("method", "Das Feld method nennt keine bekannte Zahlungsart.");
  }
  if (!REGIONS[region].paymentMethods.includes(method)) {
    return fail(
      "method",
      `Das Feld method nennt eine Zahlungsart, die in ${REGIONS[region].label} nicht angeboten wird.`,
    );
  }

  return {
    ok: true,
    value: { lines, region, method, signature: signatureParts.join("|") },
  };
}

export async function POST(
  request: Request,
): Promise<NextResponse<CheckoutPayload | FieldError>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    // A broken payload is the caller's mistake, so 400 and not 500.
    return NextResponse.json<FieldError>(
      { field: "body", error: "Der Anfragekörper ist kein gültiges JSON." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const parsed = validate(body);
  if (!parsed.ok) {
    return NextResponse.json<FieldError>(parsed.problem, {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { lines, region, method, signature } = parsed.value;
  const estimate = estimateOrder(lines, region);
  const seed = hashSignature(signature);
  // The reference stays derived from the basket, so a retry of the same order
  // reads the same. The session id must not: a deterministic id over the basket
  // gives two buyers of the same cart the same session, and makes every other
  // session guessable from a cart anyone can assemble. It gets real entropy.
  const sessionId = `sess_${region.toLowerCase()}_${method}_${randomToken()}`;

  const payload: CheckoutPayload = {
    sessionId,
    reference: orderReference(seed),
    method,
    currency: estimate.currency,
    amount: estimate.total,
    breakdown: {
      subtotal: estimate.subtotal,
      shipping: estimate.shipping,
      clearance: estimate.clearance,
      vatIncluded: estimate.vatIncluded,
      total: estimate.total,
    },
    // Stays inside the shop, because no provider is involved.
    redirectUrl: `/checkout?session=${encodeURIComponent(sessionId)}`,
    expiresInSeconds: SESSION_TTL_SECONDS,
    live: false,
  };

  return NextResponse.json<CheckoutPayload>(payload, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}

export function GET(): NextResponse<MethodNotAllowed> {
  return NextResponse.json<MethodNotAllowed>(
    {
      error: "Diese Adresse nimmt nur POST entgegen. Die Kasse findest du unter /checkout.",
      allow: ALLOWED_METHODS,
    },
    {
      status: 405,
      headers: { Allow: ALLOWED_METHODS.join(", "), "Cache-Control": "no-store" },
    },
  );
}
