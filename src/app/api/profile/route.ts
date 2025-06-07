// src/app/api/profile/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabaseクライアントを初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 認証不要で仮プロフィールを返す
export async function GET() {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: "Profile fetch failed" }, { status: 500 });
  }

  return NextResponse.json(profile);
}
