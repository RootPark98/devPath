import { NextResponse } from "next/server";

type RequestBody = {
  stack: string;
  level: string;
};

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  return NextResponse.json({
    message: `당신의 스택은 ${body.stack}, 난이도는 ${body.level} 입니다.`,
  });
}
