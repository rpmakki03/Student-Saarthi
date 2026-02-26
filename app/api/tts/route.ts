import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { z } from "zod";

const bodySchema = z.object({
  text: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { text } = bodySchema.parse(json);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // First, use Gemini to translate/convert the text to Hindi
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Convert this English text to Hindi transliteration (using English letters but Hindi pronunciation):
    
Text: ${text}

Respond with only the Hindi transliteration, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hindiText = response.text().trim();

    // Now use Google Cloud TTS to generate audio
    const client = new TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || undefined,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const request = {
      input: { text: hindiText },
      voice: {
        languageCode: 'hi-IN',
        name: 'hi-IN-Standard-A',
        ssmlGender: 'FEMALE' as const
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate: 0.8,
        pitch: 0
      },
    };

    const [ttsResponse] = await client.synthesizeSpeech(request);
    const audioContent = ttsResponse.audioContent;

    if (!audioContent) {
      throw new Error("No audio content generated");
    }

    return new Response(Buffer.from(audioContent), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=tts.mp3",
      },
    });
  } catch (error: unknown) {
    console.error("TTS API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}



