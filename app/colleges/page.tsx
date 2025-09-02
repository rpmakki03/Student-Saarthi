"use client";

import { Header } from "@/components/site/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Star } from "lucide-react";

const collegesData = [
  {
    stream: "Science",
    colleges: [
      {
        name: "Delhi Public School, R.K. Puram",
        type: "CBSE",
        location: "New Delhi",
        rating: 4.5,
        description: "One of the top CBSE schools with excellent science stream facilities",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology"]
      },
      {
        name: "St. Xavier's College",
        type: "State Board",
        location: "Mumbai",
        rating: 4.3,
        description: "Renowned institution known for academic excellence in science",
        subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science"]
      },
      {
        name: "Modern School, Barakhamba Road",
        type: "CBSE",
        location: "New Delhi",
        rating: 4.4,
        description: "Excellent infrastructure and experienced faculty for science students",
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology"]
      }
    ]
  },
  {
    stream: "Commerce",
    colleges: [
      {
        name: "Loyola College",
        type: "State Board",
        location: "Chennai",
        rating: 4.6,
        description: "Premier institution for commerce and business studies",
        subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"]
      },
      {
        name: "St. Stephen's College",
        type: "Delhi University",
        location: "New Delhi",
        rating: 4.7,
        description: "One of the most prestigious colleges for commerce education",
        subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"]
      },
      {
        name: "Presidency College",
        type: "State Board",
        location: "Kolkata",
        rating: 4.4,
        description: "Historic institution with strong commerce department",
        subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"]
      }
    ]
  },
  {
    stream: "Arts",
    colleges: [
      {
        name: "Lady Shri Ram College",
        type: "Delhi University",
        location: "New Delhi",
        rating: 4.5,
        description: "Leading women's college with excellent arts and humanities programs",
        subjects: ["History", "Political Science", "English", "Economics"]
      },
      {
        name: "Miranda House",
        type: "Delhi University",
        location: "New Delhi",
        rating: 4.6,
        description: "Top-ranked college for arts and humanities education",
        subjects: ["History", "Political Science", "English", "Sociology"]
      },
      {
        name: "Fergusson College",
        type: "State Board",
        location: "Pune",
        rating: 4.3,
        description: "Established institution with rich cultural heritage",
        subjects: ["History", "Political Science", "English", "Psychology"]
      }
    ]
  }
];

export default function CollegesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Top Colleges by Stream</h1>
          <p className="text-muted-foreground">
            Discover the best institutions for your chosen stream
          </p>
        </div>

        <div className="space-y-8">
          {collegesData.map((streamData) => (
            <div key={streamData.stream}>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {streamData.stream} Stream
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streamData.colleges.map((college, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg">{college.name}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {college.location}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{college.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{college.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{college.rating}/5</span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Subjects Offered:</h4>
                        <div className="flex flex-wrap gap-1">
                          {college.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Important Notes</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• These are general recommendations based on reputation and facilities</li>
                <li>• Always check current admission criteria and eligibility requirements</li>
                <li>• Visit colleges personally to assess infrastructure and faculty</li>
                <li>• Consider factors like location, fees, and placement records</li>
                <li>• Consult with teachers and career counselors for personalized advice</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
