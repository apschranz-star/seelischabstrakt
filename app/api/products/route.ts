/**
 * Catalogue endpoint.
 *
 * One collection per call, never both.
 *
 * The parameter used to be optional, and without it the handler answered with
 * the whole catalogue: ten pieces, both rituals, in one document that anyone can
 * open in a browser. The shop stands in one time of day and shows only that one,
 * and an answer carrying both would be the one place where that does not hold.
 * So the collection is required now, and a call without it is a field error like
 * any other, not a shortcut to everything.
 *
 * The data is static, but the handler reads searchParams, so it has to stay
 * dynamic. The caching is therefore done through the response header instead of
 * the router.
 */

import { NextResponse } from "next/server";

import { getProductsByCollection, type Collection, type Product } from "@/config/products";

export const dynamic = "force-dynamic";

const COLLECTIONS: Collection[] = ["yin", "yang"];

/** A catalogue of ten seed products changes rarely, so a shared cache may hold it for an hour. */
const CATALOGUE_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

interface ProductsPayload {
  count: number;
  collection: Collection;
  products: Product[];
}

interface FieldError {
  field: string;
  error: string;
}

function isCollection(value: string): value is Collection {
  return COLLECTIONS.some((entry) => entry === value);
}

export function GET(request: Request): NextResponse<ProductsPayload | FieldError> {
  const raw = new URL(request.url).searchParams.get("collection");

  // The message names no collection. Listing the permitted values would put both
  // rituals into one sentence, which is what this endpoint no longer does.
  const fehler = (error: string) =>
    NextResponse.json<FieldError>(
      { field: "collection", error },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );

  if (raw === null) return fehler("Der Parameter collection fehlt.");
  if (!isCollection(raw)) return fehler("Unbekannte Kollektion.");

  const products = getProductsByCollection(raw);

  return NextResponse.json<ProductsPayload>(
    { count: products.length, collection: raw, products },
    { status: 200, headers: { "Cache-Control": CATALOGUE_CACHE } },
  );
}
