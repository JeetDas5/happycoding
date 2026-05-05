/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  getPracticeProblems,
  PracticeFilters,
} from "@/actions/practice.actions";
import { useJwtSession } from "@/lib/use-jwt-session";
import Header from "@/components/header";
import Footer from "@/components/footer";
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

const COMMON_TAGS = [
  "greedy",
  "dp",
  "math",
  "graphs",
  "sortings",
  "data structures",
  "brute force",
  "constructive algorithms",
  "implementation",
  "binary search",
  "dfs and similar",
  "strings",
  "number theory",
  "trees",
  "geometry",
  "combinatorics",
  "two pointers",
];

export default function PracticePage() {
  const { data: session } = useJwtSession();
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<any[]>([]);
  const [filters, setFilters] = useState<PracticeFilters>({
    minRating: 800,
    maxRating: 1600,
    tags: [],
    limit: 5,
    excludeSolved: true,
  });

  const handleFetchProblems = async () => {
    setLoading(true);
    try {
      const result = await getPracticeProblems({
        ...filters,
        userId: session?.user?.id,
      });
      setProblems(result.problems);
      if (result.problems.length === 0) {
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
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "8rem 8rem",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-7xl h-200 bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <Header />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="text-center space-y-4">
            <Badge variant="accent" className="px-4 py-1 text-sm hero-anim-0">
              Practice Mode
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white hero-anim-1">
              Custom <span className="text-primary">Problemsets</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto hero-anim-2">
              Generate personalized practice sessions based on your skill level
              and target topics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6 hero-anim-3">
              <Card className="glass-card border-white/10 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Icon
                      name="AdjustmentsHorizontalIcon"
                      size={20}
                      className="text-primary"
                    />
                    Filters
                  </CardTitle>
                  <CardDescription className="text-white/40">
                    Adjust parameters to refine your practice set.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-white/80">
                      Rating Range: {filters.minRating} — {filters.maxRating}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
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
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
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
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white/80">
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

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:border-white/10">
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
                      className="text-white/80 cursor-pointer"
                    >
                      Exclude Solved Problems
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white/80">Tags (Overlap)</Label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {COMMON_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                            filters.tags?.includes(tag)
                              ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-accent text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary/20"
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
                <div className="grid gap-4">
                  {problems.map((problem) => (
                    <a
                      key={problem.id}
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="spotlight-card glass-card border-white/10 bg-card/40 hover:bg-white/5 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className="bg-white/5 text-white/80 border-white/10"
                              >
                                {problem.id}
                              </Badge>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                {problem.name}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {problem.tags?.map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-white/5 text-white/40 border-transparent text-[10px] uppercase tracking-widest"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-white/5 pt-4 md:pt-0">
                            <div className="text-center">
                              <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                                Rating
                              </div>
                              <div
                                className={cn(
                                  "text-lg font-bold",
                                  problem.rating >= 2000
                                    ? "text-red-400"
                                    : problem.rating >= 1600
                                    ? "text-purple-400"
                                    : problem.rating >= 1200
                                    ? "text-cyan-400"
                                    : "text-green-400"
                                )}
                              >
                                {problem.rating || "N/A"}
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                              <Icon
                                name="ArrowTopRightOnSquareIcon"
                                size={18}
                                className="text-white"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Icon
                      name="SparklesIcon"
                      size={40}
                      className="text-white/20"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Problems Generated
                  </h3>
                  <p className="text-white/40 max-w-sm">
                    Configure the filters and click &quot;Generate Set&quot; to
                    find your next challenge.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SpotlightInit />
      <ScrollAnimInit />
    </div>
  );
}
