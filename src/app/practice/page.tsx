"use client";

import { useState } from "react";
import {
  getPracticeProblems,
  PracticeFilters,
} from "@/actions/practice.actions";
import { useJwtSession } from "@/lib/use-jwt-session";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import SpotlightInit from "@/app/components/SpotlightInit";
import ScrollAnimInit from "@/app/components/ScrollAnimInit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Icon from "@/components/ui/AppIcon";
import { cn } from "@/lib/utils";
import { ITEMS_PER_PAGE, COMMON_TAGS } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: string;
  name: string;
  rating: number | null;
  tags: string[] | null;
  contestId: number | null;
  index: string;
  url: string;
}

export default function PracticePage() {
  const { data: session } = useJwtSession();
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filters, setFilters] = useState<PracticeFilters>({
    minRating: 800,
    maxRating: 1600,
    tags: [],
    limit: 5,
    excludeSolved: true,
  });

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  const totalPages = Math.ceil(problems.length / ITEMS_PER_PAGE);
  const paginatedProblems = problems.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (page < totalPages - 1) {
      setDirection(1);
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setDirection(-1);
      setPage(page - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : direction < 0 ? -20 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : direction < 0 ? 20 : 0,
      opacity: 0,
    }),
  };

  const handleFetchProblems = async () => {
    setLoading(true);
    try {
      const result = await getPracticeProblems({
        ...filters,
        userId: session?.user?.id,
      });
      setProblems(result.problems || []);
      setPage(0);
      setDirection(0);
      if (!result.problems || result.problems.length === 0) {
        toast.info(result.message || "No problems found for these filters.");
      } else {
        toast.success(`Found ${result.problems.length} problems!`);
      }
    } catch (error) {
      toast.error("Failed to fetch problems. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "8rem 8rem",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-7xl h-200 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <DashboardNavbar />

      <main className="relative z-10 pt-12 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="text-center space-y-4">
            <Badge variant="accent" className="px-4 py-1 text-sm hero-anim-0">
              Practice Mode
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground hero-anim-1">
              Custom <span className="text-primary">Problemsets</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto hero-anim-2">
              Generate personalized practice sessions based on your skill level
              and target topics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6 hero-anim-3">
              <Card className="glass-card border-border bg-card/50 backdrop-blur-xl p-1 pb-2">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Icon
                      name="AdjustmentsHorizontalIcon"
                      size={20}
                      className="text-primary"
                    />
                    Filters
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Adjust parameters to refine your practice set.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-foreground/80">
                      Rating Range: {filters.minRating} — {filters.maxRating}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          Min
                        </span>
                        <Input
                          type="number"
                          step={100}
                          value={filters.minRating}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minRating: parseInt(e.target.value),
                            })
                          }
                          className="bg-muted/50 border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          Max
                        </span>
                        <Input
                          type="number"
                          step={100}
                          value={filters.maxRating}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxRating: parseInt(e.target.value),
                            })
                          }
                          className="bg-muted/50 border-border text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground/80">
                      Problems Count: {filters.limit}
                    </Label>
                    <Input
                      type="range"
                      min={1}
                      max={20}
                      value={filters.limit}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          limit: parseInt(e.target.value),
                        })
                      }
                      className="accent-primary"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border transition-colors hover:border-primary/30">
                    <input
                      type="checkbox"
                      id="excludeSolved"
                      checked={filters.excludeSolved}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          excludeSolved: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    <Label
                      htmlFor="excludeSolved"
                      className="text-foreground/80 cursor-pointer"
                    >
                      Exclude Solved Problems
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground/80">Tags (Overlap)</Label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {COMMON_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer",
                            filters.tags?.includes(tag)
                              ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              : "bg-muted border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/70 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer"
                    onClick={handleFetchProblems}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      "Generate Set"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-6 hero-anim-4">
              {problems.length > 0 ? (
                <div className="space-y-6">
                  <div className="min-h-[400px]">
                    <AnimatePresence
                      mode="wait"
                      initial={false}
                      custom={direction}
                    >
                      <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="grid gap-4"
                      >
                        {paginatedProblems.map((problem) => (
                          <a
                            key={problem.id}
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                          >
                            <Card className="spotlight-card glass-card border-border bg-card/40 hover:bg-muted/30 transition-all duration-300 overflow-hidden">
                              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Badge
                                      variant="outline"
                                      className="bg-muted text-foreground/80 border-border"
                                    >
                                      {problem.id}
                                    </Badge>
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                      {problem.name}
                                    </h3>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {problem.tags?.map((tag: string) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-muted text-muted-foreground border-transparent text-[10px] uppercase tracking-widest"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-border pt-4 md:pt-0">
                                  <div className="text-center">
                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                                      Rating
                                    </div>
                                    <div
                                      className={cn(
                                        "text-lg font-bold",
                                        (problem.rating ?? 0) >= 2000
                                          ? "text-red-400"
                                          : (problem.rating ?? 0) >= 1600
                                          ? "text-purple-400"
                                          : (problem.rating ?? 0) >= 1200
                                          ? "text-cyan-400"
                                          : "text-green-400"
                                      )}
                                    >
                                      {problem.rating || "N/A"}
                                    </div>
                                  </div>
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <Icon
                                      name="ArrowTopRightOnSquareIcon"
                                      size={18}
                                      className="text-foreground group-hover:text-white"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </a>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-muted/20 border border-border">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        Page {page + 1} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl bg-card border-border hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer disabled:opacity-50"
                          disabled={page === 0}
                          onClick={handlePrev}
                        >
                          <Icon name="ChevronLeftIcon" size={20} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl bg-card border-border hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer disabled:opacity-50"
                          disabled={page === totalPages - 1}
                          onClick={handleNext}
                        >
                          <Icon name="ChevronRightIcon" size={20} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl bg-muted/20">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Icon
                      name="SparklesIcon"
                      size={40}
                      className="text-muted-foreground/30"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No Problems Generated
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Configure the filters and click &quot;Generate Set&quot; to
                    find your next challenge.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SpotlightInit />
      <ScrollAnimInit />
    </div>
  );
}
