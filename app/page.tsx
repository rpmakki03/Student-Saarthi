import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Compass, Target, Sparkles, Navigation, GraduationCap, Video, BookOpen, Mic } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <Header />

      <section className="relative mx-auto max-w-6xl px-4 pt-40 pb-20 z-10">
        <div className="text-center space-y-8 max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/80 backdrop-blur-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Your AI-powered career counselor</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="block">The Smart Way to</span>
            <span className="inline-block mt-2 px-2 pb-2 bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text">
              Plan Your Future
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-medium">
            Student Saarthi personalizes your stream selection and career path with AI-driven insights, tailored just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/quiz">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Take the Quiz
              </Button>
            </Link>
            <Link href="/guidance">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-2 text-lg hover:bg-secondary/50 transition-all duration-300">
                Explore Guidance <Compass className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Brainfish inspired feature cards */}
        <div className="mt-28 grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">

          {/* Left Card: Discovery */}
          <div className="glass-panel p-1 rounded-[2rem] bg-gradient-to-b from-primary/10 to-transparent">
            <div className="bg-background rounded-[1.8rem] h-full p-8 shadow-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Discover Your Path</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Answer interactive questions to uncover your hidden aptitudes and strongest interests.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-secondary">
                  <BrainCircuit className="h-5 w-5 text-secondary-foreground" />
                  <span className="font-medium">Aptitude Assessment</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20 border border-accent/30">
                  <StarIcon className="h-5 w-5 text-accent-foreground" />
                  <span className="font-medium">Interest Alignment</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Stream Recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Guidance */}
          <div className="glass-panel p-1 rounded-[2rem] bg-gradient-to-b from-accent/10 to-transparent">
            <div className="bg-background rounded-[1.8rem] h-full p-8 shadow-sm">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent-foreground">
                <Navigation className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Actionable Guidance</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Get a step-by-step roadmap, audio support, and detailed insights into top colleges.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                  <Video className="h-5 w-5" />
                  <span className="font-medium">Video Resources</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Mic className="h-5 w-5" />
                  <span className="font-medium">Hindi Voice Support</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">College Insights</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
