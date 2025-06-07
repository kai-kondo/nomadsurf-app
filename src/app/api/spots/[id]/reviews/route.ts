import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Supabaseクライアントの作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/spots/[id]/reviews
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const spotId = context.params.id;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'spot' or 'location'

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      user_id,
      spot_id,
      location_id,
      rating,
      comment,
      image_urls,
      created_at
    `
    )
    .eq(type === "location" ? "location_id" : "spot_id", spotId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
