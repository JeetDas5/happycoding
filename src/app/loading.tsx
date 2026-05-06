export default function Loading() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "8rem 8rem",
        }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-7xl h-200 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" />

      <main className="relative z-10 pt-20 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="text-center space-y-4">
            <div className="h-6 w-32 bg-muted/40 rounded-full mx-auto animate-pulse" />
            <div className="h-12 md:h-16 w-3/4 md:w-1/2 bg-muted/60 rounded-2xl mx-auto animate-pulse" />
            <div className="h-4 w-full max-w-2xl bg-muted/30 rounded-lg mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="h-[400px] bg-muted/20 border border-border/50 rounded-3xl animate-pulse flex flex-col p-6 gap-6">
                <div className="h-8 w-1/3 bg-muted/40 rounded-lg" />
                <div className="h-20 w-full bg-muted/30 rounded-xl" />
                <div className="h-20 w-full bg-muted/30 rounded-xl" />
                <div className="mt-auto h-12 w-full bg-primary/20 rounded-xl" />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 w-full bg-muted/10 border border-border/40 rounded-2xl animate-pulse flex items-center p-6 gap-6"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="h-10 w-10 bg-muted/40 rounded-full shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/2 bg-muted/40 rounded-md" />
                    <div className="flex gap-2">
                      <div className="h-4 w-16 bg-muted/20 rounded-full" />
                      <div className="h-4 w-16 bg-muted/20 rounded-full" />
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-muted/30 rounded-full ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 right-10 z-50">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping" />
          <div className="h-12 w-12 bg-card border border-border rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
