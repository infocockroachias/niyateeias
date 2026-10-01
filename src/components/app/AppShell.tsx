"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore, parseHash, type ViewName } from "@/lib/store";
import { Providers } from "./Providers";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingContact } from "./FloatingContact";
import { ChatWidget } from "./ChatWidget";
import { CartSheet } from "./CartSheet";
import { HomeView } from "@/components/views/HomeView";
import { AboutView } from "@/components/views/AboutView";
import { NewsView } from "@/components/views/NewsView";
import { ResourcesView } from "@/components/views/ResourcesView";
import { PaperReaderView } from "@/components/views/PaperReaderView";
import { AIHubView } from "@/components/views/AIHubView";
import { AIEvaluateView } from "@/components/views/AIEvaluateView";
import { AIChatView } from "@/components/views/AIChatView";
import { AIMcqView } from "@/components/views/AIMcqView";
import { AIGeoView } from "@/components/views/AIGeoView";
import { PlansView } from "@/components/views/PlansView";
import { CoursesView } from "@/components/views/CoursesView";
import { CourseDetailView } from "@/components/views/CourseDetailView";
import { RankersView } from "@/components/views/RankersView";
import { BooksView } from "@/components/views/BooksView";
import { TestSeriesView } from "@/components/views/TestSeriesView";
import { ContactView } from "@/components/views/ContactView";
import { LoginView } from "@/components/views/LoginView";
import { RegisterView } from "@/components/views/RegisterView";
import { DashboardView } from "@/components/views/DashboardView";

function renderView(view: ViewName) {
  switch (view) {
    case "about":
      return <AboutView />;
    case "news":
      return <NewsView />;
    case "resources":
      return <ResourcesView />;
    case "pyq-reader":
      return <PaperReaderView />;
    case "ai-hub":
      return <AIHubView />;
    case "ai-evaluate":
      return <AIEvaluateView />;
    case "ai-chat":
      return <AIChatView embedded={false} />;
    case "ai-mcq":
      return <AIMcqView />;
    case "ai-geo":
      return <AIGeoView />;
    case "plans":
      return <PlansView />;
    case "courses":
      return <CoursesView />;
    case "course-detail":
      return <CourseDetailView />;
    case "rankers":
      return <RankersView />;
    case "books":
      return <BooksView />;
    case "test-series":
      return <TestSeriesView />;
    case "contact":
      return <ContactView />;
    case "login":
      return <LoginView />;
    case "register":
      return <RegisterView />;
    case "dashboard":
      return <DashboardView />;
    case "home":
    default:
      return <HomeView />;
  }
}

export function AppShell() {
  const view = useAppStore((s) => s.view);
  const params = useAppStore((s) => s.params);

  // Read hash on load + keep store in sync with hash navigation
  useEffect(() => {
    const applyHash = () => {
      const parsed = parseHash(window.location.hash);
      const { view: currentView, params: currentParams } = useAppStore.getState();
      const same =
        currentView === parsed.view &&
        JSON.stringify(currentParams) === JSON.stringify(parsed.params);
      if (!same) {
        useAppStore.setState({ view: parsed.view, params: parsed.params });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Scroll to top whenever the view (or its params) change
  const paramKey = useMemo(() => JSON.stringify(params), [params]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, paramKey]);

  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main id="main-content" className="flex-1" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${view}?${paramKey}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {renderView(view)}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      <FloatingContact />
      <ChatWidget />
      <CartSheet />
      <span className="sr-only">{`Current view: ${view}`}</span>
    </Providers>
  );
}
