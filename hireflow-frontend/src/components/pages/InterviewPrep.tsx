import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import {
  Play,
  Pause,
  RotateCcw,
  Mic,
  Video,
  MessageSquare,
  Clock,
  Target,
  Star,
  ChevronRight,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  Brain,
  TrendingUp,
} from "lucide-react";
import { Page } from "../App";

interface InterviewPrepProps {
  user: any;
  onNavigate: (page: Page) => void;
}

interface Question {
  id: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  tips: string[];
  sampleAnswer?: string;
  timeLimit: number;
}

const mockQuestions: Question[] = [
  {
    id: "1",
    category: "Behavioral",
    difficulty: "Medium",
    question:
      "Tell me about a time when you had to work with a difficult team member.",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on your actions and what you learned",
      "Show empathy and problem-solving skills",
    ],
    timeLimit: 120,
  },
  {
    id: "2",
    category: "Technical",
    difficulty: "Hard",
    question:
      "Explain how you would design a URL shortener like bit.ly.",
    tips: [
      "Start with requirements and constraints",
      "Consider scalability and data storage",
      "Discuss database design and caching",
    ],
    timeLimit: 180,
  },
  {
    id: "3",
    category: "Behavioral",
    difficulty: "Easy",
    question:
      "Why are you interested in working at our company?",
    tips: [
      "Research the company thoroughly",
      "Connect your values with theirs",
      "Mention specific products or initiatives",
    ],
    timeLimit: 90,
  },
  {
    id: "4",
    category: "Technical",
    difficulty: "Medium",
    question:
      "How would you implement a LRU (Least Recently Used) cache?",
    tips: [
      "Think about data structures needed",
      "Consider time complexity requirements",
      "Explain your approach step by step",
    ],
    timeLimit: 150,
  },
];

const categories = [
  {
    name: "Behavioral",
    count: 45,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Technical",
    count: 38,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "System Design",
    count: 22,
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Company Specific",
    count: 15,
    color: "bg-red-100 text-red-700",
  },
];

const practiceStats = {
  questionsAnswered: 24,
  averageScore: 8.2,
  improvementRate: "+15%",
  totalPracticeTime: "4h 32m",
};

export default function InterviewPrep({
  user,
  onNavigate,
}: InterviewPrepProps) {
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [currentQuestion, setCurrentQuestion] =
    useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [practiceMode, setPracticeMode] = useState<
    "text" | "voice" | "video"
  >("text");

  const startPractice = (question: Question) => {
    setCurrentQuestion(question);
    setTimeRemaining(question.timeLimit);
    setUserAnswer("");
    setShowFeedback(false);
  };

  const submitAnswer = () => {
    setShowFeedback(true);
    setIsRecording(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const QuestionCard = ({
    question,
  }: {
    question: Question;
  }) => (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
    >
      <Card className="border-2 hover:border-red-200 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    categories.find(
                      (c) => c.name === question.category,
                    )?.color || ""
                  }
                >
                  {question.category}
                </Badge>
                <Badge
                  className={getDifficultyColor(
                    question.difficulty,
                  )}
                >
                  {question.difficulty}
                </Badge>
              </div>
              <h3 className="font-medium text-sm leading-relaxed">
                {question.question}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{question.timeLimit}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>{question.tips.length} tips</span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => startPractice(question)}
            >
              <Play className="w-3 h-3 mr-1" />
              Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Interview Preparation
              </h1>
              <p className="text-muted-foreground">
                Practice with AI-powered feedback and improve
                your interview skills
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Mock Interview
              </Button>
              <Button className="gradient-primary">
                <Video className="w-4 h-4 mr-2" />
                Start Practice Session
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Questions Answered
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {practiceStats.questionsAnswered}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {practiceStats.averageScore}/10
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Improvement
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {practiceStats.improvementRate}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Practice Time
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {practiceStats.totalPracticeTime}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {!currentQuestion ? (
            // Question Browser
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Question Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant={
                          selectedCategory === "all"
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start"
                        onClick={() =>
                          setSelectedCategory("all")
                        }
                      >
                        All Questions
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.name}
                          variant={
                            selectedCategory === category.name
                              ? "default"
                              : "ghost"
                          }
                          className="w-full justify-between"
                          onClick={() =>
                            setSelectedCategory(category.name)
                          }
                        >
                          <span>{category.name}</span>
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {category.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Practice Mode */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Practice Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "text",
                          label: "Text Response",
                          icon: MessageSquare,
                        },
                        {
                          id: "voice",
                          label: "Voice Recording",
                          icon: Mic,
                        },
                        {
                          id: "video",
                          label: "Video Practice",
                          icon: Video,
                        },
                      ].map((mode) => (
                        <Button
                          key={mode.id}
                          variant={
                            practiceMode === mode.id
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start"
                          onClick={() =>
                            setPracticeMode(mode.id as any)
                          }
                        >
                          <mode.icon className="w-4 h-4 mr-3" />
                          {mode.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Interview Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                          Research the company beforehand
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Practice the STAR method</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                          Prepare thoughtful questions
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                          Show enthusiasm and curiosity
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Questions Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory === "all"
                      ? "All Questions"
                      : selectedCategory}{" "}
                    Questions
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Sort by:
                    </span>
                    <Button variant="outline" size="sm">
                      Difficulty
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Practice Interface
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Question & Response */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            categories.find(
                              (c) =>
                                c.name ===
                                currentQuestion.category,
                            )?.color || ""
                          }
                        >
                          {currentQuestion.category}
                        </Badge>
                        <Badge
                          className={getDifficultyColor(
                            currentQuestion.difficulty,
                          )}
                        >
                          {currentQuestion.difficulty}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentQuestion(null)}
                      >
                        ← Back to Questions
                      </Button>
                    </div>
                    <CardTitle className="text-lg leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Your Response
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {Math.floor(timeRemaining / 60)}:
                          {(timeRemaining % 60)
                            .toString()
                            .padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {practiceMode === "text" ? (
                      <Textarea
                        placeholder="Type your response here..."
                        value={userAnswer}
                        onChange={(e) =>
                          setUserAnswer(e.target.value)
                        }
                        className="min-h-32"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <div
                          className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            isRecording
                              ? "bg-red-100 animate-pulse"
                              : "bg-muted"
                          }`}
                        >
                          {practiceMode === "voice" ? (
                            <Mic
                              className={`w-12 h-12 ${isRecording ? "text-red-500" : "text-muted-foreground"}`}
                            />
                          ) : (
                            <Video
                              className={`w-12 h-12 ${isRecording ? "text-red-500" : "text-muted-foreground"}`}
                            />
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {isRecording
                            ? "Recording..."
                            : `Click to start ${practiceMode} recording`}
                        </p>
                        <Button
                          onClick={() =>
                            setIsRecording(!isRecording)
                          }
                          className={
                            isRecording
                              ? "bg-red-500 hover:bg-red-600"
                              : ""
                          }
                        >
                          {isRecording ? (
                            <Pause className="w-4 h-4 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {isRecording
                            ? "Stop Recording"
                            : "Start Recording"}
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <Progress
                        value={
                          ((currentQuestion.timeLimit -
                            timeRemaining) /
                            currentQuestion.timeLimit) *
                          100
                        }
                        className="flex-1"
                      />
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setTimeRemaining(
                              currentQuestion.timeLimit,
                            )
                          }
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={submitAnswer}
                          disabled={!userAnswer && !isRecording}
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            AI Feedback
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Overall Score: 8.5/10
                              </h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Structure
                                  </span>
                                  <div className="font-medium text-green-600">
                                    Excellent
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Content
                                  </span>
                                  <div className="font-medium text-green-600">
                                    Good
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Delivery
                                  </span>
                                  <div className="font-medium text-yellow-600">
                                    Needs Work
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">
                                Strengths:
                              </h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                  • Clear use of STAR method
                                </li>
                                <li>
                                  • Specific examples and
                                  metrics
                                </li>
                                <li>
                                  • Good conflict resolution
                                  approach
                                </li>
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">
                                Areas for Improvement:
                              </h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                  • Could be more concise in
                                  explanation
                                </li>
                                <li>
                                  • Add more detail about
                                  lessons learned
                                </li>
                                <li>
                                  • Practice maintaining eye
                                  contact
                                </li>
                              </ul>
                            </div>

                            <Button
                              className="w-full mt-4"
                              onClick={() =>
                                setCurrentQuestion(null)
                              }
                            >
                              Practice Another Question
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tips & Help */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Tips for This Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentQuestion.tips.map(
                        (tip, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <span>{tip}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-3" />
                      View Sample Answer
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      Ask AI for Guidance
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      <Users className="w-4 h-4 mr-3" />
                      Schedule Mock Interview
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}