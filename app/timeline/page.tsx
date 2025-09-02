"use client";

import { Header } from "@/components/site/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Briefcase } from "lucide-react";

const timelineData = [
  {
    year: "10th Class",
    title: "Complete 10th Standard",
    description: "Finish your 10th class board examinations",
    icon: BookOpen,
    color: "bg-blue-500"
  },
  {
    year: "11th-12th Class",
    title: "Choose Your Stream",
    description: "Select Science, Commerce, or Arts based on your interests and career goals",
    icon: GraduationCap,
    color: "bg-green-500"
  },
  {
    year: "12th Class",
    title: "Board Examinations",
    description: "Prepare for and complete your 12th standard board exams",
    icon: BookOpen,
    color: "bg-purple-500"
  },
  {
    year: "After 12th",
    title: "Higher Education",
    description: "Apply for colleges, universities, or professional courses",
    icon: GraduationCap,
    color: "bg-orange-500"
  },
  {
    year: "Graduation",
    title: "Complete Degree",
    description: "Finish your undergraduate studies in your chosen field",
    icon: GraduationCap,
    color: "bg-red-500"
  },
  {
    year: "Post-Graduation",
    title: "Specialize Further",
    description: "Optional: Pursue master's degree or professional certifications",
    icon: Briefcase,
    color: "bg-indigo-500"
  }
];

export default function TimelinePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Academic Timeline</h1>
          <p className="text-muted-foreground">
            Your journey from 10th class to higher education and beyond
          </p>
        </div>

        <div className="space-y-6">
          {timelineData.map((item, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.year}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This timeline is a general guide. Your actual path may vary based on your choices and circumstances.
          </p>
        </div>
      </div>
    </main>
  );
}
