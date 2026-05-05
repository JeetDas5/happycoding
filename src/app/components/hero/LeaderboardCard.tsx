import AppImage from '@/components/ui/AppImage';

const entries = [
  { rank: 1, handle: 'tourist', rating: 3979, delta: '+42', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', color: 'text-yellow-400' },
  { rank: 2, handle: 'neal_wu', rating: 3668, delta: '+18', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', color: 'text-slate-300' },
  { rank: 3, handle: 'Petr', rating: 3629, delta: '+11', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', color: 'text-amber-600' },
  { rank: 4, handle: 'you', rating: 1847, delta: '+7', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face', color: 'text-primary dark:text-accent' },
];

export default function LeaderboardCard() {
  return (
    <div className="glass-card w-65 lg:w-68 rounded-2xl p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Global Leaderboard</span>
        <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">LIVE</span>
      </div>
      <div className="space-y-2">
        {entries?.map((e) => (
          <div
            key={e?.handle}
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
              e?.handle === 'you' ?'bg-accent/10 border border-accent/20' :'hover:bg-muted'
            }`}
          >
            <span className={`text-xs font-bold font-mono w-5 text-center  ${e?.color}`}>
              {e?.rank}
            </span>
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
              <AppImage
                src={e?.avatar}
                alt={`${e?.handle} avatar`}
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-sm font-semibold flex-1 ${e?.handle === 'you' ? 'text-primary' : 'text-foreground/90'}`}>
              {e?.handle}
            </span>
            <span className="text-xs font-mono text-muted-foreground">{e?.rating}</span>
            <span className="text-[10px] font-mono text-emerald-400">{e?.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}