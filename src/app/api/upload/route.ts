import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "@/lib/db";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const uploadsDir = getUploadsDir();

  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ filename });
}
