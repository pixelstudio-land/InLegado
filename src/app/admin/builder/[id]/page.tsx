'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockForms } from '@/data/mockQuizzes'
import { QuizForm, QuizQuestion } from '@/types/quiz'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { ArrowLeft, Save, Eye, Palette, Plus, Trash2, Smartphone, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react'

export default function QuizBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params?.id as string

  const initialForm = mockForms.find(f => f.id === formId) || mockForms[0]
  const [form, setForm] = useState<QuizForm>(initialForm)
  const [activeTab, setActiveTab] = useState<'questions' | 'theme' | 'whatsapp'>('questions')
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)

  const currentQ = form.questions[selectedQuestionIndex]

  const handleUpdateTitle = (val: string) => {
    setForm(prev => ({ ...prev, title: val }))
  }

  const handleUpdateThemeColor = (color: string) => {
    setForm(prev => ({
      ...prev,
      theme: { ...prev.theme, primaryColor: color }
    }))
  }

  const handleUpdateBadge = (val: string) => {
    setForm(prev => ({
      ...prev,
      theme: { ...prev.theme, socialProofBadge: val }
    }))
  }

  const handleSave = () => {
    alert("Alterações salvas com sucesso no InLegado!")
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      
      {/* Builder Navbar */}
      <header className="h-16 border-b border-slate-800 bg-[#0d121c] px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Construtor Visual</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Estilo Canva
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Cliente: {form.clientName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/quiz/${form.id}`}
            target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Ao Vivo</span>
          </Link>

          <button
            onClick={handleSave}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </header>

      {/* Main Builder Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Control Panel (The Canva-like toolbox) */}
        <div className="w-full lg:w-[480px] border-r border-slate-800 bg-[#0a0d14] flex flex-col h-full overflow-y-auto">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-[#0d121c] text-xs font-bold">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 py-3 border-b-2 text-center transition-colors ${
                activeTab === 'questions' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              📝 Perguntas ({form.questions.length})
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 border-b-2 text-center transition-colors ${
                activeTab === 'theme' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              🎨 Cores & Visual
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-3 border-b-2 text-center transition-colors ${
                activeTab === 'whatsapp' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              💬 WhatsApp & Final
            </button>
          </div>

          <div className="p-5 space-y-6 flex-1">
            
            {/* Tab 1: Questions */}
            {activeTab === 'questions' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Título do Formulário</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Question List pills */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Etapas / Perguntas:</label>
                  <div className="space-y-1.5">
                    {form.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuestionIndex(idx)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          selectedQuestionIndex === idx
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {idx + 1}. {q.title}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800">
                          {q.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit Selected Question */}
                {currentQ && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Editando Pergunta {selectedQuestionIndex + 1}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400">Texto da Pergunta</label>
                      <input
                        type="text"
                        value={currentQ.title}
                        onChange={(e) => {
                          const updated = [...form.questions]
                          updated[selectedQuestionIndex].title = e.target.value
                          setForm({ ...form, questions: updated })
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                      />
                    </div>

                    {currentQ.subtitle !== undefined && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Subtítulo / Instrução</label>
                        <input
                          type="text"
                          value={currentQ.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...form.questions]
                            updated[selectedQuestionIndex].subtitle = e.target.value
                            setForm({ ...form, questions: updated })
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Theme & Visuals */}
            {activeTab === 'theme' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Cor Primária da Marca</label>
                  <p className="text-[11px] text-slate-400">Escolha uma paleta rápida com 1 clique:</p>
                  <div className="flex items-center gap-3 pt-1">
                    {[
                      { name: 'Dourado Legado', color: '#c58e41' },
                      { name: 'Laranja Real Pisos', color: '#f97316' },
                      { name: 'Azul Construtora', color: '#2563eb' },
                      { name: 'Verde Esmeralda', color: '#10b981' },
                      { name: 'Roxo Moderno', color: '#8b5cf6' },
                    ].map((p) => (
                      <button
                        key={p.color}
                        onClick={() => handleUpdateThemeColor(p.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          form.theme.primaryColor === p.color ? 'scale-125 border-white ring-2 ring-amber-500' : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: p.color }}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Selo de Prova Social no Topo</label>
                  <input
                    type="text"
                    value={form.theme.socialProofBadge || ''}
                    onChange={(e) => handleUpdateBadge(e.target.value)}
                    placeholder="Ex: ⭐ + de 1.000 clientes atendidos"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: WhatsApp & Thank You */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Número do WhatsApp Comercial</label>
                  <input
                    type="text"
                    value={form.thankYouScreen.whatsappNumber || ''}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        thankYouScreen: { ...form.thankYouScreen, whatsappNumber: e.target.value }
                      })
                    }}
                    placeholder="5511999999999 (com DDI e DDD)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Texto do Botão CTA Final</label>
                  <input
                    type="text"
                    value={form.thankYouScreen.ctaText}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        thankYouScreen: { ...form.thankYouScreen, ctaText: e.target.value }
                      })
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Live Smartphone Mockup (What the lead sees) */}
        <div className="flex-1 bg-[#05070a] p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Pré-visualização em Tempo Real (Visão do Celular)</span>
            </div>

            {/* Phone Frame */}
            <div className="w-[360px] sm:w-[390px] h-[720px] rounded-[42px] border-[8px] border-slate-800 bg-[#0e121b] shadow-2xl shadow-black/90 overflow-hidden flex flex-col relative mx-auto">
              
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto z-20 flex-shrink-0" />

              {/* Screen Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <QuizPlayer form={form} isEmbed={true} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
