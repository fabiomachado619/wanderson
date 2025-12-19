import React, { useState, useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  GraduationCap, 
  Building2, 
  BrainCircuit, 
  Smartphone, 
  XCircle, 
  Briefcase, 
  MousePointerClick, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight, 
  Users, 
  ShieldCheck, 
  User, 
  PlayCircle,
  ChevronDown
} from 'lucide-react';

/**
 * Controller de Atmosfera (Background Dinâmico)
 * Gerencia as cores, gradientes e luzes de fundo baseando-se na fase atual da história.
 */
const AtmosphereController = ({ phase }: { phase: number }) => {
  // Definição visual de cada fase narrativa
  const phases = {
    1: { // VIDA NORMAL (Rotina, Estável)
      bg: "bg-slate-950",
      gradient: "from-slate-900/50 via-slate-950 to-slate-950",
      spotlight: "bg-blue-900/5",
      gridOpacity: "opacity-[0.03]"
    },
    2: { // INCÔMODO (Escuro, Pesado, Fechado)
      bg: "bg-[#020617]", // Almost black
      gradient: "from-black/80 via-slate-950 to-black/80",
      spotlight: "bg-slate-800/0", // Sem luz
      gridOpacity: "opacity-[0.01]" // Grid quase sumindo
    },
    3: { // DECISÃO (Luz surgindo, Esperança)
      bg: "bg-slate-900",
      gradient: "from-indigo-950/30 via-slate-900 to-slate-950",
      spotlight: "bg-indigo-500/10",
      gridOpacity: "opacity-[0.04]"
    },
    4: { // REVELAÇÃO (Clareza, Lógica, Cyan)
      bg: "bg-slate-900",
      gradient: "from-cyan-950/30 via-slate-900 to-slate-950",
      spotlight: "bg-cyan-500/10",
      gridOpacity: "opacity-[0.05]"
    },
    5: { // CRESCIMENTO (Vibrante, Energia, Azul Forte)
      bg: "bg-slate-900",
      gradient: "from-blue-900/40 via-slate-900 to-slate-950",
      spotlight: "bg-blue-500/15",
      gridOpacity: "opacity-[0.06]"
    },
    6: { // AÇÃO (Portal, Verde/Dourado sutil, Decisão)
      bg: "bg-slate-950",
      gradient: "from-emerald-950/40 via-slate-900 to-slate-950",
      spotlight: "bg-emerald-500/10",
      gridOpacity: "opacity-[0.05]"
    }
  };

  const current = phases[phase as keyof typeof phases] || phases[1];

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ${current.bg}`}>
      {/* Luz Central (Spotlight) - Move e muda de cor suavemente */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full blur-[120px] transition-all duration-1000 ease-in-out ${current.spotlight}`}
      ></div>

      {/* Gradiente de Atmosfera */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] transition-all duration-1000 ease-in-out ${current.gradient}`}></div>

      {/* Grid Técnico */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${current.gridOpacity}`} 
        style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      ></div>
      
      {/* Noise Texture (Mantém consistência) */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

/**
 * Curva de conexão SVG responsiva.
 */
const ConnectorCurve = ({ direction }: { direction: 'ltr' | 'rtl' }) => {
  return (
    <div className="absolute top-full left-0 w-full h-24 -mt-8 -mb-8 pointer-events-none overflow-visible hidden md:block z-0">
      <svg 
        viewBox="0 0 400 100" 
        className="w-full h-full" 
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0px 0px 4px rgba(6, 182, 212, 0.3))' }}
      >
        <path 
          d={direction === 'ltr' 
            ? "M 100,0 C 100,50 300,50 300,100" 
            : "M 300,0 C 300,50 100,50 100,100"
          }
          fill="none" 
          stroke="url(#gradient-line)" 
          strokeWidth="2" 
          strokeDasharray="8 4"
          className="opacity-40"
        />
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

interface StoryBlockProps {
  icon: LucideIcon;
  text: string;
  subtext: string | null;
  highlight?: boolean;
  isLast?: boolean;
  accentColor?: 'cyan' | 'orange';
  index: number;
  onVisible: (phase: number) => void;
  phase: number;
}

const StoryBlock = ({ icon: Icon, text, subtext, highlight = false, isLast = false, accentColor = "cyan", index, onVisible, phase }: StoryBlockProps) => {
  const isEven = index % 2 === 0;
  const blockRef = useRef<HTMLDivElement | null>(null);
  const [hasAppeared, setHasAppeared] = useState(false);

  // Detecta quando o bloco entra na tela para acionar a mudança de fase
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(phase);
          if (!hasAppeared) {
            setHasAppeared(true);
            if (blockRef.current) {
              observer.unobserve(blockRef.current);
            }
          }
        }
      },
      { threshold: 0.6 } // Aciona quando 60% do bloco está visível
    );

    if (blockRef.current && !hasAppeared) {
      observer.observe(blockRef.current);
    }

    return () => {
      if (blockRef.current) observer.unobserve(blockRef.current);
    };
  }, [phase, onVisible, hasAppeared]);

  // Cores dinâmicas
  const borderColor = highlight ? (accentColor === 'orange' ? 'border-orange-500/50' : 'border-cyan-500/50') : 'border-slate-800';
  const glowColor = highlight ? (accentColor === 'orange' ? 'shadow-orange-900/30' : 'shadow-cyan-900/30') : 'shadow-none';
  const iconColor = accentColor === 'orange' ? 'text-orange-400' : 'text-cyan-400';
  const textColor = accentColor === 'orange' ? 'text-orange-200' : 'text-cyan-200';

  return (
    <div
      ref={blockRef}
      className={`relative w-full max-w-5xl mx-auto mb-0 md:mb-12 py-8 group transition-all duration-700 ease-out ${
        hasAppeared ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      
      {!isLast && <ConnectorCurve direction={isEven ? 'ltr' : 'rtl'} />}
      {!isLast && <div className="absolute left-8 top-full w-px h-16 bg-gradient-to-b from-slate-700 to-transparent md:hidden"></div>}

      <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        
        {/* IMAGEM */}
        <div className="relative w-full md:w-1/2 px-4 md:px-0 z-10">
          <div className={`
            relative w-full aspect-[16/9] md:aspect-[3/2] rounded-2xl overflow-hidden 
            bg-slate-900/90 backdrop-blur-md border ${borderColor} 
            shadow-2xl ${glowColor} transition-all duration-500
            transform hover:scale-[1.02] hover:-translate-y-1
            flex flex-col items-center justify-center
          `}>
            <div className="absolute top-3 right-3 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`p-4 rounded-full bg-slate-950/50 border border-slate-800 mb-3 ${accentColor === 'orange' ? 'group-hover:border-orange-500/30' : 'group-hover:border-cyan-500/30'}`}>
                <Icon size={48} strokeWidth={1.5} className={iconColor} />
              </div>
              <span className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">Cena {index + 1}</span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          </div>
          
          <div className="absolute left-8 top-full -translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 md:hidden mt-2 border-2 border-slate-950"></div>
        </div>

        {/* TEXTO */}
        <div className={`w-full md:w-1/2 px-6 md:px-0 flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
          <div className={`
            relative max-w-sm p-6 rounded-xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-sm
            group-hover:border-slate-700 transition-colors duration-300
            ${isEven ? 'text-left' : 'text-left md:text-right'}
          `}>
            <div className={`absolute top-0 ${isEven ? 'left-0' : 'left-0 md:left-auto md:right-0'} w-8 h-8 overflow-hidden`}>
              <div className={`absolute top-0 ${isEven ? 'left-0' : 'left-0 md:right-0'} w-2 h-2 border-t border-${isEven ? 'l' : 'l md:r'}-0 border-slate-500`}></div>
            </div>

            {subtext && (
              <div className={`flex items-center gap-2 mb-3 ${isEven ? '' : 'md:justify-end'}`}>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${textColor}`}>
                  {subtext}
                </span>
                <div className={`h-px w-8 ${accentColor === 'orange' ? 'bg-orange-900' : 'bg-cyan-900'}`}></div>
              </div>
            )}
            
            <h3 className="text-lg text-slate-200 font-medium leading-relaxed">
              {text.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
};

const CTASection = ({ onVisible }: { onVisible: (phase: number) => void }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(6); // Fase 6: AÇÃO
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, [onVisible]);

  return (
    <div ref={sectionRef} className="relative w-full max-w-3xl mx-auto mt-32 mb-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-emerald-600/20 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="relative bg-slate-900/90 border border-slate-700 rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl shadow-black/50">
        <div className="absolute -top-20 -right-20 opacity-10 pointer-events-none rotate-12">
          <PlayCircle size={300} strokeWidth={0.5} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            EVENTO AO VIVO • VAGAS LIMITADAS
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Agora é a sua chance de entender<br className="md:hidden" />
            por que você ainda não teve resultado no digital
          </h2>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>

          <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Nesta quinta-feira, às 20h (horário de Brasília),
            vou mostrar ao vivo o que realmente separa
            quem tenta de quem consegue resultado.
          </p>

          <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Nada de teoria solta.<br className="md:hidden" />
            Nada de promessa vazia.<br className="md:hidden" />
            É a lógica real por trás dos números que você viu nessa página.
          </p>

          <button className="group mt-6 relative w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 px-10 rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>
              <div className="flex items-center justify-center gap-3">
                <Smartphone size={24} />
                <span className="text-lg">Entrar no grupo VIP agora</span>
              </div>
          </button>
          
          <p className="text-xs text-slate-500 mt-2 font-mono">
            ⚠️ O acesso à aula é liberado apenas para quem entrar no grupo. As vagas podem ser encerradas sem aviso.
          </p>

          <p className="text-xs text-slate-500 font-mono">
            Aula ao vivo • Conteúdo exclusivo • Quinta-feira às 20h
          </p>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => (
  <section className="relative w-full z-20 bg-slate-950">
    {/* Full Width Image Container */}
    <div className="relative w-full">
      
      {/* IMAGEM MOBILE (Apenas telas pequenas) */}
      <img 
        src="https://aquivos.fm1.pro/wp-content/uploads/2025/12/ChatGPT-Image-18-de-dez.-de-2025-21_14_38.png" 
        alt="Transformação Digital Mobile" 
        className="block md:hidden w-full h-auto object-cover"
      />

      {/* IMAGEM DESKTOP/TABLET (Apenas telas médias e grandes) */}
      <img 
        src="https://aquivos.fm1.pro/wp-content/uploads/2025/12/wnadeseon-fundo-azul.png" 
        alt="Transformação Digital Desktop" 
        className="hidden md:block w-full h-auto object-cover md:object-top"
      />
      
      {/* Visual Merge Gradient (Bottom Fade) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
    </div>
  </section>
);

const App = () => {
  const [currentPhase, setCurrentPhase] = useState(1);

  // Mapeamento das fases da história para controle do background
  const storyData: Array<{
    phase: number;
    icon: LucideIcon;
    subtext: string | null;
    text: string;
    highlight?: boolean;
    accentColor?: 'cyan' | 'orange';
  }> = [
    { phase: 1, icon: GraduationCap, subtext: "2016", text: "Ciências Contábeis\nMinha história não é muito diferente da sua" },
    { phase: 1, icon: Building2, subtext: "2016–2020", text: "Acreditando na história de sucesso do sistema\nCLT em escritório contábil" },
    { phase: 2, icon: BrainCircuit, subtext: null, text: "Já entendia que essa vida\nnão me levaria ao resultado que eu buscava" },
    { phase: 2, icon: Smartphone, subtext: "2018", text: "Algo diferente cruzou meu caminho\nR$10 por venda chamou minha atenção", highlight: true },
    { phase: 2, icon: XCircle, subtext: null, text: "Tentei\nNão funcionou\nDesisti", highlight: true, accentColor: "orange" },
    { phase: 2, icon: Briefcase, subtext: null, text: "Currículo\nVaga\nEscritório" },
    { phase: 3, icon: Zap, subtext: "2019", text: "Vi um curso de marketing digital\nNão acreditei" },
    { phase: 3, icon: MousePointerClick, subtext: null, text: "Mesmo com medo\neu arrisquei", highlight: true, accentColor: "orange" },
    { phase: 4, icon: TrendingUp, subtext: null, text: "No primeiro dia, apliquei\nNo mesmo dia, fiz minha primeira venda", highlight: true },
    { phase: 4, icon: BrainCircuit, subtext: null, text: "Ali entendi\nNão era sorte\nEra lógica" },
    { phase: 5, icon: BarChart3, subtext: null, text: "Resultados consistentes\nPrimeiros R$100 mil", highlight: true },
    { phase: 5, icon: ArrowUpRight, subtext: null, text: "Percebi que existia um teto\nConheci os lançamentos" },
    { phase: 5, icon: Users, subtext: null, text: "R$430 mil em 1 ano e 6 meses\ncom um único expert", highlight: true },
    { phase: 5, icon: ShieldCheck, subtext: null, text: "Me especializei no que poucos dominam\nRecuperação de vendas", accentColor: "orange" },
    { phase: 5, icon: User, subtext: null, text: "Não foi uma linha reta\nFoi constância" }
  ];

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden">
      
      {/* Background Controller (Controla as fases narrativas abaixo do Hero) */}
      <AtmosphereController phase={currentPhase} />

      {/* HERO SECTION - HEADER VISUAL */}
      <HeroSection />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-10">
        
        {/* Header da Seção de História */}
        <header className="text-center mb-32 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-sm">
            <p className="text-cyan-400 tracking-[0.2em] text-[10px] font-bold uppercase">Start The Journey</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tight">
            MINHA HISTÓRIA
          </h1>
          <p className="mt-4 text-slate-500 font-light max-w-md mx-auto">
            Não é sobre sorte. É sobre entender os padrões que ninguém te contou.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="p-2 rounded-full border border-slate-800 animate-bounce text-slate-600">
              <ChevronDown size={20} />
            </div>
          </div>
        </header>

        {/* The Zig-Zag Story Trail */}
        <div className="relative w-full">
          {storyData.map((data, index) => (
            <StoryBlock 
              key={index}
              index={index}
              phase={data.phase}
              onVisible={setCurrentPhase}
              icon={data.icon}
              subtext={data.subtext}
              text={data.text}
              highlight={data.highlight}
              accentColor={data.accentColor}
              isLast={index === storyData.length - 1}
            />
          ))}
        </div>

        {/* Bloco de conclusão pós-jornada */}
        <section className="relative w-full max-w-5xl mx-auto mt-24 mb-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-slate-900/0 to-emerald-600/10 rounded-3xl blur-3xl opacity-40 pointer-events-none"></div>
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="space-y-6 text-slate-200">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Agora é a sua vez.
                </h2>
                <p className="text-lg text-slate-300">
                  Se você chegou até aqui, é porque essa história também fala sobre você.
                </p>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>Você não leu essa história por acaso.</p>
                <p>Em algum ponto, você se enxergou nela.</p>
                <p>Talvez no começo, cheio de dúvidas.</p>
                <p>Talvez no meio, tentando fazer dar certo e não conseguindo romper.</p>
                <p>Talvez agora, sentindo que sabe que existe algo maior — mas ainda não conseguiu acessar.</p>
                <p>Se você quer entrar no digital,</p>
                <p>ou se já está no jogo, mas ainda não alcançou resultados consistentes,</p>
                <p>o problema não foi falta de esforço.</p>
                <p>Foi falta de clareza.</p>
              </div>

              <div className="space-y-3">
                <p className="text-white font-semibold">Na aula ao vivo, eu vou abrir a caixa preta.</p>
                <p className="text-slate-300 leading-relaxed">
                  Vou te mostrar a lógica real por trás dos resultados que você viu nessa jornada.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Sem atalhos. <br className="md:hidden" />Sem promessas vazias. <br className="md:hidden" />Sem teoria desconectada da prática.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-white font-semibold">Quando você sair dessa aula, você não vai ser a mesma pessoa.</p>
                <p className="text-slate-300 leading-relaxed">Você vai entender:</p>
                <ul className="list-disc list-inside text-slate-200 space-y-2 pl-1">
                  <li>por que ainda não deu certo</li>
                  <li>o que realmente trava os resultados</li>
                  <li>e o que precisa ser feito para virar o jogo de forma consciente e consistente</li>
                </ul>
              </div>

              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>
                  Você vai aprender com alguém que vive isso na prática,
                  que já teve resultado,
                  e que conhece o jogo por dentro — não de fora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Banner repetido do topo para reforço final, mantendo responsivo */}
        <div className="-mx-6 md:mx-0">
          <HeroSection />
        </div>

        {/* Final CTA */}
        <CTASection onVisible={setCurrentPhase} />

        {/* Footer */}
        <footer className="text-center text-slate-800 text-xs py-12 border-t border-slate-900 mt-12">
          <p>© 2024 • Feito para quem decide.</p>
        </footer>

      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 30px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;