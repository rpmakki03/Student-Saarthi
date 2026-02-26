import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const bodySchema = z.object({
  answer: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { answer } = bodySchema.parse(json);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are Student Saarthi, a counselor for Indian students after 10th class.
You must respond in valid JSON format only with these exact fields:
{
  "stream": "recommended stream (Science/Commerce/Arts)",
  "rationale": "explanation for the recommendation",
  "subjects": ["list", "of", "recommended", "subjects"],
  "careers": ["list", "of", "potential", "careers"],
  "colleges_advice": "advice about colleges and institutions",
  "next_steps": ["list", "of", "next", "steps", "to", "take"]
}

Keep the language simple and India-contextual. Focus on practical advice.`;

    const userPrompt = `Student input: ${answer}

Please provide career guidance based on this input.`;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }

    const raw = jsonMatch[0];
    const parsed = JSON.parse(raw);

    const resultData = {
      stream: parsed.stream ?? "Science",
      rationale: parsed.rationale ?? "",
      subjects: parsed.subjects ?? [],
      careers: parsed.careers ?? [],
      colleges_advice: parsed.colleges_advice ?? "",
      next_steps: parsed.next_steps ?? [],
    };

    return new Response(JSON.stringify(resultData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Guidance API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}



