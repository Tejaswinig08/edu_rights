// Temporary local data layer. Replace with protected API calls when learning content is available.
import { BookOpen, Ear, GraduationCap, LockKeyhole, Scale, ShieldCheck, UsersRound } from "lucide-react";

export const iconMap = { education: GraduationCap, safety: ShieldCheck, equality: UsersRound, voice: Ear, privacy: LockKeyhole, rights: Scale, learn: BookOpen };

export const getDashboardData = () => new Promise((resolve) => {
  window.setTimeout(() => resolve({
    progress: { level: 2, title: "Rights Explorer", currentXP: 120, nextLevelXP: 200, completedTopics: 2 },
    modules: [
      { id: "rights", title: "Know Your Rights", description: "Discover the important rights every child has.", icon: "rights", status: "completed", progress: 100, points: 30, difficulty: "Beginner", duration: "8 min" },
      { id: "education", title: "Right to Education", description: "Find out why learning belongs to every child.", icon: "education", status: "in-progress", progress: 65, points: 40, difficulty: "Beginner", duration: "10 min" },
      { id: "safety", title: "Right to Safety", description: "Learn how to recognise safe people and places.", icon: "safety", status: "not-started", progress: 0, points: 40, difficulty: "Beginner", duration: "9 min" },
      { id: "equality", title: "Right to Equality", description: "Everyone deserves fairness, respect, and belonging.", icon: "equality", status: "not-started", progress: 0, points: 50, difficulty: "Explorer", duration: "12 min" },
      { id: "voice", title: "Right to Be Heard", description: "Your ideas and feelings matter.", icon: "voice", status: "locked", progress: 0, points: 50, difficulty: "Explorer", duration: "10 min" },
      { id: "privacy", title: "Right to Privacy", description: "Understand how to protect personal information.", icon: "privacy", status: "locked", progress: 0, points: 60, difficulty: "Explorer", duration: "11 min" },
    ],
    quizzes: [
      { id: "quiz-rights", title: "Rights Basics Quiz", topic: "Know Your Rights", questionsCount: 5, points: 20, status: "completed", score: 4 },
      { id: "quiz-education", title: "Learning Matters Quiz", topic: "Right to Education", questionsCount: 5, points: 25, status: "not-started", score: null },
    ],
    badges: [
      { id: "first-quest", name: "First Quest", earned: true, icon: "⭐" }, { id: "quiz-starter", name: "Quiz Starter", earned: true, icon: "🧠" }, { id: "explorer", name: "Rights Explorer", earned: true, icon: "🧭" }, { id: "champion", name: "Knowledge Champion", earned: false, icon: "🏆" },
    ],
    knowledgeHub: [
      { id: "article-1", category: "Articles", title: "What are children's rights?", description: "A quick guide to rights that help you grow safely.", time: "3 min read" },
      { id: "faq-1", category: "FAQs", title: "Who can I talk to if I feel unsafe?", description: "Simple steps to find a trusted adult who can help.", time: "2 min read" },
      { id: "case-1", category: "Real-Life Cases", title: "Aisha shares her idea", description: "See how speaking up made a difference at school.", time: "4 min read" },
    ],
    activity: [{ id: "a1", title: 'Completed "Know Your Rights"', detail: "+30 XP", icon: "✓" }, { id: "a2", title: 'Earned "Rights Explorer"', detail: "+30 XP", icon: "🏆" }, { id: "a3", title: "Reached Level 2", detail: "Keep going to unlock Level 3!", icon: "★" }],
  }), 350);
});
