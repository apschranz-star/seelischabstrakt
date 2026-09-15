/**
 * Catalogue endpoint.
 *
 * The data is static, but the handler reads searchParams, so it has to stay dynamic.
 * The caching is therefore done through the response header instead of the router.
 */

import { NextResponse } from "next/server";

import {
  PRODUCTS,
  getProductsByCollection,
  type Collection,
  type Product,
} from "@/config/products";

export const dynamic = "force-dynamic";

const COLLECTIONS: Collection[] = ["yin", "yang"];

/** A catalogue of eight seed products changes rarely, so a shared cache may hold it for an hour. */
const CATALOGUE_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

interface ProductsPayload {
  count: number;
  /** Null when the whole catalogue was requested. */
  collection: Collection | null;
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

  let collection: Collection | null = null;
  if (raw !== null) {
    if (!isCollection(raw)) {
      return NextResponse.json<FieldError>(
        {
          field: "collection",
          error: 'Unbekannte Kollektion. Erlaubt sind "yin" und "yang", oder gar kein Parameter.',
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    collection = raw;
  }

  const products = collection === null ? PRODUCTS : getProductsByCollection(collection);

  return NextResponse.json<ProductsPayload>(
    { count: products.length, collection, products },
    { status: 200, headers: { "Cache-Control": CATALOGUE_CACHE } },
  );
}
