import Link from 'next/link'
import { ArrowRight, Sparkles, LayoutDashboard, ShieldCheck, Zap, Layers, BarChart3, Smartphone, ExternalLink } from 'lucide-react'
import { mockForms } from '@/data/mockQuizzes'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0c1017]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20">
              IN
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-100 tracking-tight">InLegado</span>
              <span className="ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PROPRIETÁRIO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Painel Administrativo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm animate-pulse-subtle">
          <Sparkles className="w-4 h-4" />
          <span>O Clone Definitivo do Inlead & Respondi para a Legado</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
          Qualificação Comercial de <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Alta Conversão & Margem Infinita
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Substitua o Respondi e o Inlead por uma plataforma proprietária para cada cliente da Legado. Sem mensalidades por licença, com design estilo Canva e integrado nativamente ao seu CRM.
        </p>
      </section>

      {/* Live Demonstrations Showcase */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Quizzes Demonstrativos Prontos</h2>
            <p className="text-xs text-slate-400">Escolha uma versão abaixo para testar no celular ou no computador:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockForms.map((form) => (
            <div
              key={form.id}
              className="group relative rounded-2xl bg-gradient-to-b from-[#111622] to-[#0c0f17] border border-slate-800 hover:border-amber-500/50 p-6 shadow-xl transition-all duration-300 hover:shadow-amber-500/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {form.clientName}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Ativo para Teste
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {form.description}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    ⚡ {form.questions.length} Perguntas
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    📲 Direto pro WhatsApp
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    🎯 Rastreio de UTMs
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                <Link
                  href={`/quiz/${form.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Testar Quiz Interativo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/admin/builder/${form.id}`}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                  title="Abrir no Construtor Visual"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Pillars for Leo */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-200">Zero Custo por Licença</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crie quantos quizzes e formulários quiser para cada cliente da assessoria sem pagar R$ 1 a mais por isso.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-200">Visual Estilo Canva</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A Juliana consegue montar formulários visuais com paleta de cores da marca, fotos dos produtos e selos de prova social.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-200">Conexão Nativa com CRM</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              O lead qualificado cai direto no CRM da Legado e o WhatsApp abre com o consultor com mensagem personalizada.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>InLegado - Plataforma Exclusiva desenvolvida para a Assessoria Legado.</p>
      </footer>

    </div>
  )
}
