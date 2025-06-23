import { NextResponse } from "next/server";
import { IExportLogsServiceRequest } from "@/lib/types";

export async function GET() {
  if (!process.env.API_URL) {
    return NextResponse.json(
      { error: "API_URL environment variable is not set" },
      { status: 500 }
    );
  }
  try {
    const response = await fetch(process.env.API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IExportLogsServiceRequest = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
