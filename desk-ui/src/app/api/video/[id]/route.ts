import { BASE_URL } from "@/app/constants/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    const courseInfo = await fetch(`${BASE_URL}/course/:id?id=${id}`, {
      method: "GET",
    });

    if (!courseInfo.ok) {
      throw new Error(`HTTP error! status: ${courseInfo.status}`);
    }

    const courseData = await courseInfo.json();

    return NextResponse.json({ courseData }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data" },
      { status: 500 }
    );
  }
}
