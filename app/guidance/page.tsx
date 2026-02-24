"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, Loader2, FileText } from "lucide-react";

type GuidanceResult = {
  stream: string;
  rationale: string;
  subjects: string[];
  careers: string[];
  colleges_advice: string;
  next_steps: string[];
  language?: "hi" | "en" | "hinglish";
};

type QuizData = {
  question: string;
  answer: string;
  category: string;
};

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function GuidanceContent() {
  const searchParams = useSearchParams();
  const [answer, setAnswer] = useState("");
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSpeechSupported = useMemo(() => {
    return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    // Parse quiz data from URL params if available
    const quizParam = searchParams.get('quizData');
    if (quizParam) {
      try {
        const parsed = JSON.parse(quizParam) as QuizData[];
        setQuizData(parsed);
        setShowQuizResults(true);

        // Create a summary from quiz answers
        const summary = parsed.map(q => `${q.question}: ${q.answer}`).join('. ');
        setAnswer(summary);
      } catch (error) {
        console.error("Error parsing quiz data:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isSpeechSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SR();
    recognition.lang = "hi-IN"; // Works for Hindi and Hinglish; English is typically recognized too
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        transcript += res[0].transcript;
      }
      if (transcript.trim()) {
        setAnswer((prev) => (prev ? prev + " " : "") + transcript.trim());
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch { }
      recognitionRef.current = null;
    };
  }, [isSpeechSupported]);

  async function fetchGuidance() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Validate the response structure and provide fallbacks
      const validatedResult: GuidanceResult = {
        stream: data.stream || "Science",
        rationale: data.rationale || "Based on your interests and goals, we recommend this stream.",
        subjects: Array.isArray(data.subjects) ? data.subjects : ["Physics", "Chemistry", "Mathematics"],
        careers: Array.isArray(data.careers) ? data.careers : ["Engineering", "Technology", "Research"],
        colleges_advice: data.colleges_advice || "Focus on colleges with strong programs in your chosen stream.",
        next_steps: Array.isArray(data.next_steps) ? data.next_steps : ["Research colleges", "Prepare for entrance exams", "Talk to counselors"],
        language: data.language || "en"
      };

      setResult(validatedResult);
    } catch (error) {
      console.error("Error fetching guidance:", error);
      // Set a fallback result instead of leaving it null
      setResult({
        stream: "Science",
        rationale: "We encountered an issue with the AI service. Here's a general recommendation based on your input: Consider Science stream if you enjoy mathematics and problem-solving.",
        subjects: ["Physics", "Chemistry", "Mathematics"],
        careers: ["Engineering", "Technology", "Research"],
        colleges_advice: "Focus on colleges with strong science programs. Consider both government and private institutions.",
        next_steps: ["Research colleges in your area", "Prepare for entrance exams", "Talk to teachers and counselors", "Visit college campuses"],
        language: "en"
      });
    } finally {
      setLoading(false);
    }
  }

  function toggleRecording() {
    if (!isSpeechSupported) return;
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isRecording) {
      try { recognition.stop(); } catch { }
      setIsRecording(false);
    } else {
      setAudioUrl(null);
      setResult(null);
      try { recognition.start(); setIsRecording(true); } catch { }
    }
  }

  async function speakHindi() {
    if (!result) return;
    setIsSpeaking(true);
    try {
      const text = `Stream: ${result.stream}. Rationale: ${result.rationale}. Subjects: ${result.subjects.join(", ")}. Careers: ${result.careers.join(", ")}. ${result.colleges_advice}. Next steps: ${result.next_steps.join(", ")}.`;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsSpeaking(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 pt-32 pb-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-center mb-2">Career Guidance</h1>
            <p className="text-muted-foreground text-center">
              Tell us about your interests, or take our quiz to get personalized recommendations
            </p>
          </div>

          {showQuizResults && quizData.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quiz Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quizData.map((item, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{item.question}</span>
                      <span className="text-blue-600 ml-2">→ {item.answer}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Textarea
                className="flex-1 min-h-[120px]"
                placeholder="Describe your interests, favorite subjects, goals, or any other information that might help with career guidance..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={toggleRecording}
                  disabled={!isSpeechSupported || loading}
                  aria-pressed={isRecording}
                  title={isSpeechSupported ? (isRecording ? "Stop Recording" : "Start Voice Input") : "Speech not supported"}
                  className="w-12 h-12 p-0"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                {!isSpeechSupported && (
                  <span className="text-xs text-muted-foreground text-center">Voice input not supported</span>
                )}
              </div>
            </div>

            {isRecording && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Listening... Speak now
              </div>
            )}

            <Button
              onClick={fetchGuidance}
              disabled={loading || !answer.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Guidance...
                </>
              ) : (
                "Get Career Guidance"
              )}
            </Button>
          </div>

          {result && (
            <Card className="mt-8 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">
                  Recommended Stream: {result.stream}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">{result.rationale}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recommended Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.subjects.map((subject, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Potential Careers</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.careers.map((career, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Colleges & Advice</h4>
                  <p className="text-sm text-muted-foreground">{result.colleges_advice}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Next Steps</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {result.next_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    variant="secondary"
                    onClick={speakHindi}
                    disabled={isSpeaking}
                    className="flex-1"
                  >
                    {isSpeaking ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        🔊 Listen in Hindi
                      </>
                    )}
                  </Button>
                  {audioUrl && (
                    <audio controls src={audioUrl} className="flex-1" />
                  )}
                </div>

                <div className="text-xs text-muted-foreground border-t pt-4 text-center">
                  ⚠️ This is guidance only. Please consult teachers/parents before final decisions.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

export default function GuidancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuidanceContent />
    </Suspense>
  );
}


