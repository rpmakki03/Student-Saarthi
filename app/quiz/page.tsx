"use client";

import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
}

const quizQuestions: QuizQuestion[] = [
  // Aptitude Questions
  {
    id: 1,
    category: "aptitude",
    question: "How do you feel about solving mathematical problems?",
    options: ["I love it and find it exciting", "I'm comfortable with it", "I find it challenging but manageable", "I struggle with it"]
  },
  {
    id: 2,
    category: "aptitude",
    question: "When reading, what type of content interests you most?",
    options: ["Scientific articles and research", "Business and economics", "Literature and creative writing", "Historical accounts"]
  },
  {
    id: 3,
    category: "aptitude",
    question: "How do you prefer to work on projects?",
    options: ["Independently with clear guidelines", "In teams with shared responsibilities", "With creative freedom", "Following established procedures"]
  },
  // Interest Questions
  {
    id: 4,
    category: "interest",
    question: "Which subject do you enjoy studying the most?",
    options: ["Mathematics and Science", "Business and Economics", "Languages and Literature", "Social Studies and History"]
  },
  {
    id: 5,
    category: "interest",
    question: "What would you like to do in your free time?",
    options: ["Experiment with technology", "Read business magazines", "Write stories or poems", "Learn about different cultures"]
  },
  {
    id: 6,
    category: "interest",
    question: "Which career field appeals to you the most?",
    options: ["Engineering and Technology", "Business and Management", "Arts and Media", "Education and Social Work"]
  },
  // Future Goals
  {
    id: 7,
    category: "goals",
    question: "What is your primary goal after completing education?",
    options: ["Get a high-paying technical job", "Start my own business", "Pursue creative passions", "Help others and make a difference"]
  },
  {
    id: 8,
    category: "goals",
    question: "Where do you see yourself in 10 years?",
    options: ["Leading technical projects", "Running a successful company", "Creating artistic content", "Working in community development"]
  }
];

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < quizQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    try {
      // Create a profile summary from quiz answers
      const profile = quizQuestions.map(q => ({
        question: q.question,
        answer: answers[q.id],
        category: q.category
      }));

      // Navigate to guidance page with quiz results
      const queryParams = new URLSearchParams({
        quizData: JSON.stringify(profile)
      });

      router.push(`/guidance?${queryParams.toString()}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setLoading(false);
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Added pt-32 to push content below the fixed header */}
      <div className="mx-auto max-w-2xl px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full glass-panel border-none shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              Career Guidance Quiz
            </CardTitle>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground text-center">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div>
              <h3 className="text-xl font-semibold mb-6 leading-relaxed text-foreground">{currentQ.question}</h3>
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`q${currentQ.id}-${index}`} />
                    <Label htmlFor={`q${currentQ.id}-${index}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion === quizQuestions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={loading || Object.keys(answers).length < quizQuestions.length}
                >
                  {loading ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQ.id]}
                >
                  Next
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground text-center">
              {Object.keys(answers).length} of {quizQuestions.length} questions answered
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
