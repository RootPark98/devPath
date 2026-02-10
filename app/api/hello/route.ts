import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "안녕! 서버에서 왔어!",
    });
}