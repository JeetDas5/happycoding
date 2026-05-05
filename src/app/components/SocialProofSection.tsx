import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const testimonials = [
{
  name: 'Marcus Chen',
  role: 'Competitive Programmer',
  company: 'MIT',
  rating: 2187,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_137692231-1766574908745.png",
  quote: 'My Codeforces rating jumped 300 points in 3 months. The daily streak forces consistency — that\'s the real secret to improvement.',
  streak: 62,
  statusColor: 'bg-emerald-500',
  num: '01'
},
{
  name: 'Priya Sharma',
  role: 'ICPC Finalist',
  company: 'IIT Delhi',
  rating: 1934,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1aef0318d-1772770041121.png",
  quote: 'I started HappyCoding to compete with my lab mates. Now our entire department of 40 people uses it for internal rankings.',
  streak: 45,
  statusColor: 'bg-accent',
  num: '02'
},
{
  name: 'Kevin O\'Brien',
  role: 'Software Engineer',
  company: 'Google',
  rating: 2341,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1376855d2-1772668745655.png",
  quote: 'The point system makes you actually think about problem difficulty. You can\'t just grind easy problems — you have to push yourself.',
  streak: 89,
  statusColor: 'bg-purple-500',
  num: '03'
},
{
  name: 'Sofia Nakamura',
  role: 'CS Student',
  company: 'Carnegie Mellon',
  rating: 1756,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_186e35b9b-1769454113150.png",
  quote: 'Setting up the Codeforces integration took 2 minutes. Now my submissions automatically count toward my streak. No extra work.',
  streak: 27,
  statusColor: 'bg-yellow-400',
  num: '04'
},
{
  name: 'Arjun Mehta',
  role: 'Team Lead',
  company: 'Codeforces Top 500',
  rating: 2590,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_152db0fb7-1769397531783.png",
  quote: 'Running our ICPC training through HappyCoding org features is a game changer. I can see exactly who\'s slacking.',
  streak: 103,
  statusColor: 'bg-rose-400',
  num: '05'
},
{
  name: 'Emma Wilson',
  role: 'Competitive Programmer',
  company: 'Oxford University',
  rating: 1623,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b2cee3f9-1772276893959.png",
  quote: 'The leaderboard resets monthly so I always feel like I have a chance. Even as a beginner I can compete in my rating bracket.',
  streak: 19,
  statusColor: 'bg-teal-400',
  num: '06'
}];


const stats = [
{ value: '1,200+', label: 'Active coders', icon: 'UserGroupIcon' as const },
{ value: '50K+', label: 'Problems solved', icon: 'CodeBracketIcon' as const },
{ value: '47 days', label: 'Avg streak length', icon: 'FireIcon' as const },
{ value: '98%', label: 'Codeforces sync accuracy', icon: 'CheckCircleIcon' as const }];


export default function SocialProofSection() {
  return (
    <section
      id="social-proof"
      className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative"
      aria-label="Social proof and testimonials">
      
      {/* Background watermark */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center w-full"
        style={{
          maskImage: 'linear-gradient(180deg, transparent, black 10%, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black 10%, black 70%, transparent)'
        }}>
        
        <span
          className="font-extrabold text-white/[0.025] tracking-tighter whitespace-nowrap"
          style={{ fontSize: 'clamp(4rem, 13vw, 13rem)' }}>
          
          Community
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16 animate-on-scroll opacity-100 scroll-anim-1 relative z-10">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent mb-4">
            <span className="w-1 h-1 rounded-full bg-accent" />
            Trusted by Competitors
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
            Coders who grind together, rank together
          </h2>
        </div>
        <div className="max-w-sm lg:text-right">
          <p className="text-base md:text-lg text-muted-foreground font-body font-light leading-relaxed">
            From Div. 4 beginners to Grandmaster-level competitors — HappyCoding adds a competitive layer to everyone's practice.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 relative z-10 animate-on-scroll opacity-100 scroll-anim-2">
        {stats.map((s) =>
        <div
          key={s.label}
          className="spotlight-card rounded-2xl p-5 border border-white/[0.06] bg-card flex flex-col gap-2">
          
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name={s.icon} size={16} variant="solid" className="text-accent" />
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono animate-count-glow">{s.value}</span>
            <span className="text-xs text-muted-foreground font-body">{s.label}</span>
          </div>
        )}
      </div>

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {testimonials.map((t, idx) =>
        <div
          key={t.name}
          className={`spotlight-card rounded-2xl p-7 border border-white/[0.06] bg-card animate-on-scroll opacity-100 flex flex-col justify-between scroll-anim-${Math.min(idx + 2, 7)}`}>
          
            <div>
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <AppImage
                      src={t.avatar}
                      alt={`${t.name} profile photo`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${t.statusColor} rounded-full border-2 border-card`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">{t.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{t.role} · {t.company}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    {t.rating} CF
                  </span>
                  <span className="text-[10px] font-mono text-orange-400">
                    🔥 {t.streak}d
                  </span>
                </div>
              </div>

              {/* Quote */}
              <p className="text-base font-light leading-relaxed text-white/80 font-body italic mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono text-muted-foreground">{t.num}</span>
              <Icon name="ArrowTopRightOnSquareIcon" size={14} className="text-accent/50" />
            </div>
          </div>
        )}
      </div>
    </section>);

}