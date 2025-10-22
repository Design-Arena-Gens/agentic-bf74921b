import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const configFilePath = path.join(process.cwd(), "config.json");

export async function POST(request: Request) {
  try {
    const { senderEmail, keywords } = await request.json();

    if (!senderEmail || !keywords) {
      return NextResponse.json(
        { error: "senderEmail and keywords are required" },
        { status: 400 }
      );
    }

    const config = { senderEmail, keywords };

    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2));

    return NextResponse.json({ message: "Configuration saved successfully" });
  } catch (error) {
    console.error("Error saving configuration:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await fs.access(configFilePath);
    const configData = await fs.readFile(configFilePath, "utf-8");
    const config = JSON.parse(configData);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
  }
}
