import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function splitToLinesByWidth(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number,
) {
  const lines: string[] = [];
  const paragraphs = String(text ?? "").split("\n");

  for (const para of paragraphs) {
    if (para === "") {
      lines.push("");
      continue;
    }

    let current = "";
    for (const ch of Array.from(para)) {
      const next = current + ch;
      const w = font.widthOfTextAtSize(next, fontSize);

      if (w > maxWidth && current.length > 0) {
        lines.push(current);
        current = ch;
      } else {
        current = next;
      }
    }
    lines.push(current);
  }

  return lines;
}

export async function POST(req: Request) {
  const { title, text } = await req.json();

  // ✅ 폰트 로드
  const fontPath = path.join(process.cwd(), "assets", "fonts", "NotoSansKR-Regular.ttf");
  const fontBytes = await fs.readFile(fontPath);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // ✅ 한글 깨짐 방지: subset false
  const font = await pdfDoc.embedFont(fontBytes, { subset: false });

  // ===== 레이아웃 파라미터 =====
  const A4: [number, number] = [595.28, 841.89];

  // ✅ 좌/우 여백 분리 (원하는 대로 조절)
  const marginLeft = 56;
  const marginRight = 150; // 오른쪽만 더 여유 주고 싶으면 이 값만 키우면 됨

  // 위/아래는 “과하면 싫다” 했으니 적당히 유지
  const marginTop = 64;
  const marginBottom = 56;

  const fontSizeTitle = 20;
  const fontSizeBody = 12;
  const lineHeight = 18;

  const titleText = String(title ?? "DevPath Export");
  const bodyText = String(text ?? "");

  const makePage = () => pdfDoc.addPage(A4);

  let page = makePage();
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // ✅ 실제 본문 폭: 좌+우 여백을 각각 반영
  const maxWidth = pageWidth - marginLeft - marginRight;

  // ===== 첫 페이지: 제목 1회만 =====
  let y = pageHeight - marginTop;

  page.drawText(titleText, {
    x: marginLeft,
    y: y - fontSizeTitle,
    size: fontSizeTitle,
    font,
    color: rgb(0.1, 0.1, 0.12),
  });

  // 구분선(원하면 제거 가능)
  const ruleY = y - fontSizeTitle - 14;
  page.drawLine({
    start: { x: marginLeft, y: ruleY },
    end: { x: pageWidth - marginLeft, y: ruleY }, // ✅ 오른쪽 여백 반영
    thickness: 1,
    color: rgb(0.88, 0.88, 0.9),
  });

  y = ruleY - 18;

  // ===== 본문 =====
  const lines = splitToLinesByWidth(bodyText, font, fontSizeBody, maxWidth);

  for (const line of lines) {
    // 페이지 넘어감
    if (y < marginBottom + lineHeight) {
      page = makePage();
      y = pageHeight - marginTop; // 다음 페이지는 제목 없이 본문만

      // 다음 페이지도 본문 폭 동일
      // (maxWidth는 페이지마다 동일하니 그대로 사용)
    }

    if (line === "") {
      y -= lineHeight;
      continue;
    }

    page.drawText(line, {
      x: marginLeft,
      y: y - fontSizeBody,
      size: fontSizeBody,
      font,
      color: rgb(0.16, 0.16, 0.18),
      maxWidth,
    });

    y -= lineHeight;
  }

  const bytes = await pdfDoc.save();

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        (titleText || "devpath-export") + ".pdf",
      )}"`,
    },
  });
}