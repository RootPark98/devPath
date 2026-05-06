import { loadEnvConfig } from "@next/env";
import fs from "node:fs/promises";

loadEnvConfig(process.cwd());

import type { GeneratePlanInput } from "../lib/devpath/types";
import {
  generatePlanPipeline,
  GeneratePipelineError,
} from "../lib/devpath/server/generate-pipeline";

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY가 .env.local에 없습니다.");
  }

  const body: GeneratePlanInput = {
    projectType: "web",
    language: "Python",
    level: "초급",
    domain: "education",
    frameworks: [],
  };

  console.log("Generating DevPath plan...");
  console.log("Input:", body);

  const output = await generatePlanPipeline({
    apiKey,
    body,
  });

  await fs.mkdir("tmp", { recursive: true });

  await fs.writeFile(
    "tmp/generated-plan.json",
    JSON.stringify(
      {
        input: body,
        output,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("\nGenerated output:");
  console.log(JSON.stringify(output, null, 2));
  console.log("\nSaved to tmp/generated-plan.json");
}

main().catch((e: unknown) => {
  if (e instanceof GeneratePipelineError) {
    console.error(`[${e.code}] ${e.message}`);

    if (e.details) {
      console.error("details:", e.details);
    }

    if (e.rawText) {
      console.error("rawText:", e.rawText);
    }

    process.exit(1);
  }

  console.error(e);
  process.exit(1);
});