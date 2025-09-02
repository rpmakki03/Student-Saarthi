import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { FileText, Lightbulb, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Student Saarthi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered career counselor for personalized stream and career guidance after 10th class.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Take Our Quiz</h3>
              <p className="text-sm text-muted-foreground">
                Answer questions about your interests and aptitude to get personalized recommendations
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Get Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Receive detailed career advice, subject recommendations, and next steps
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Voice Support</h3>
              <p className="text-sm text-muted-foreground">
                Use voice input and listen to guidance in Hindi for better understanding
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/quiz">
              <Button size="lg" className="w-full sm:w-auto">
                Start Quiz
              </Button>
            </Link>
            <Link href="/guidance">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get Guidance
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
