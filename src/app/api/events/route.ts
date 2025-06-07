import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase クライアントの作成（Server Side用）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ← こっちに変更
);

export async function GET() {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      organizer_id,
      spot_id,
      datetime,
      location,
      tags,
      image_url,
      created_at
    `
    )
    .order("datetime", { ascending: true });

  if (error) {
    console.error("[Supabase Fetch Error]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalizedData = data.map((event) => ({
    ...event,
    tags:
      typeof event.tags === "string"
        ? event.tags.replace(/[{}"]/g, "").split(",")
        : event.tags,
  }));

  return NextResponse.json(normalizedData);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const organizer_id = formData.get("organizer_id") as string;
  const spot_id = formData.get("spot_id") as string;
  const datetime = formData.get("datetime") as string;
  const location = formData.get("location") as string;
  const tags = (formData.get("tags") as string).split(",");

  const filePath = `${crypto.randomUUID()}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("event-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("event-images")
    .getPublicUrl(filePath);

  const { error: insertError } = await supabase.from("events").insert([
    {
      title,
      description,
      organizer_id,
      spot_id,
      datetime,
      location,
      tags,
      image_url: urlData.publicUrl,
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
