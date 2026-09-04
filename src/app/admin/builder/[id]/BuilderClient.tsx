'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getFormById, saveForm } from '@/lib/storage'
import { QuizForm, QuizQuestion, QuestionType, QuizOption } from '@/types/quiz'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { 
  ArrowLeft, Save, Eye, Palette, Plus, Trash2, Smartphone, 
  MessageCircle, Sparkles, Check, CheckCircle2, ChevronUp, ChevronDown 
} from 'lucide-react'

interface BuilderClientProps {
  formId: string
  initialForm: QuizForm
}

export function BuilderClient({ formId, initialForm }: BuilderClientProps) {
  // Start immediately with initialForm - ZERO LOADING SCREEN!
  const [form, setForm] = useState<QuizForm>(initialForm)
  const [activeTab, setActiveTab] = useState<'questions' | 'theme' | 'whatsapp'>('questions')
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [savedToast, setSavedToast] = useState(false)
  const [previewMode, setPreviewMode] = useState<'sync' | 'interactive'>('sync')

  // Check localStorage for saved version on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && formId) {
      try {
        const stored = getFormById(formId)
        if (stored) {
          setForm(JSON.parse(JSON.stringify(stored)))
        }
      } catch (e) {
        console.error('Error loading stored form:', e)
      }
    }
  }, [formId])

  const currentQ: QuizQuestion | undefined = form.questions?.[selectedQuestionIndex]

  // Question Management
  const handleAddQuestion = () => {
    const newId = `q_${Date.now()}`
    const newQuestion: QuizQuestion = {
      id: newId,
      title: "Nova Pergunta de Qualificação",
      subtitle: "Insira uma explicação ou instrução para o lead:",
      type: "multiple_choice",
      options: [
        { id: `opt_${Date.now()}_1`, label: "Opção 1", icon: "⭐" },
        { id: `opt_${Date.now()}_2`, label: "Opção 2", icon: "🚀" }
      ]
    }

    setForm(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }))
    setSelectedQuestionIndex(form.questions?.length || 0)
  }

  const handleDeleteQuestion = (indexToDelete: number) => {
    if ((form.questions?.length || 0) <= 1) {
      alert("O formulário precisa de pelo menos 1 pergunta!")
      return
    }

    setForm(prev => {
      const updated = (prev.questions || []).filter((_, idx) => idx !== indexToDelete)
      return { ...prev, questions: updated }
    })

    if (selectedQuestionIndex >= indexToDelete && selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1)
    }
  }

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= (form.questions?.length || 0)) return

    setForm(prev => {
      const questions = [...(prev.questions || [])]
      const temp = questions[index]
      questions[index] = questions[targetIndex]
      questions[targetIndex] = temp
      return { ...prev, questions }
    })
    setSelectedQuestionIndex(targetIndex)
  }

  const handleUpdateQuestion = (field: keyof QuizQuestion, value: any) => {
    setForm(prev => {
      const questions = [...(prev.questions || [])]
      questions[selectedQuestionIndex] = {
        ...questions[selectedQuestionIndex],
        [field]: value
      }
      return { ...prev, questions }
    })
  }

  // Options Management
  const handleAddOption = () => {
    if (!currentQ) return
    const newOpt: QuizOption = {
      id: `opt_${Date.now()}`,
      label: "Nova Opção",
      icon: "✨",
      subtitle: ""
    }

    setForm(prev => {
      const questions = [...(prev.questions || [])]
      const existingOpts = questions[selectedQuestionIndex].options || []
      questions[selectedQuestionIndex] = {
        ...questions[selectedQuestionIndex],
        options: [...existingOpts, newOpt]
      }
      return { ...prev, questions }
    })
  }

  const handleUpdateOption = (optIndex: number, field: keyof QuizOption, value: string) => {
    setForm(prev => {
      const questions = [...(prev.questions || [])]
      const opts = [...(questions[selectedQuestionIndex].options || [])]
      opts[optIndex] = {
        ...opts[optIndex],
        [field]: value
      }
      questions[selectedQuestionIndex] = {
        ...questions[selectedQuestionIndex],
        options: opts
      }
      return { ...prev, questions }
    })
  }

  const handleDeleteOption = (optIndex: number) => {
    setForm(prev => {
      const questions = [...(prev.questions || [])]
      const opts = (questions[selectedQuestionIndex].options || []).filter((_, i) => i !== optIndex)
      questions[selectedQuestionIndex] = {
        ...questions[selectedQuestionIndex],
        options: opts
      }
      return { ...prev, questions }
    })
  }

  // Save changes to localStorage
  const handleSave = () => {
    saveForm(form)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      
      {/* Builder Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-[#0d121c] px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="font-bold text-sm sm:text-base text-slate-100 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-500 outline-none transition-all py-0.5"
              />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase tracking-wider hidden sm:inline-block">
                Editor Visual
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Cliente: {form.clientName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedToast && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvo com sucesso!</span>
            </div>
          )}

          <Link
            href={`/quiz/${form.id}`}
            target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ver Link</span>
            <span>Ao Vivo</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </header>

      {/* Main Builder Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Control Panel */}
        <div className="w-full lg:w-[480px] border-r border-slate-800 bg-[#0a0d14] flex flex-col h-full overflow-y-auto">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-[#0d121c] text-xs font-bold flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
                activeTab === 'questions' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              📝 Perguntas ({form.questions?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
                activeTab === 'theme' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              🎨 Cores & Marca
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
                activeTab === 'whatsapp' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              💬 WhatsApp & Conversão
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">

            {/* TAB 1: QUESTIONS MANAGEMENT */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                
                {/* Questions List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Fluxo de Perguntas ({form.questions?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nova Pergunta</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(form.questions || []).map((q, idx) => (
                      <div
                        key={q.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          selectedQuestionIndex === idx 
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold shadow-sm' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                        onClick={() => setSelectedQuestionIndex(idx)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                            {idx + 1}
                          </span>
                          <span className="truncate">{q.title}</span>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveQuestion(idx, 'up')}
                            className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                            title="Subir"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (form.questions?.length || 0) - 1}
                            onClick={() => handleMoveQuestion(idx, 'down')}
                            className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                            title="Descer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                            title="Remover pergunta"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Active Question Details */}
                {currentQ && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        Editando Pergunta {selectedQuestionIndex + 1}
                      </span>
                      
                      {/* Question Type Selector */}
                      <select
                        value={currentQ.type}
                        onChange={(e) => handleUpdateQuestion('type', e.target.value as QuestionType)}
                        className="bg-slate-950 border border-slate-700 text-[11px] text-slate-200 rounded px-2 py-1 outline-none focus:border-amber-500 cursor-pointer font-medium"
                      >
                        <option value="multiple_choice">Múltipla Escolha (Cards)</option>
                        <option value="text">Texto Livre (Nome / Resposta)</option>
                        <option value="phone">Telefone / WhatsApp</option>
                        <option value="number">Número</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium">Título da Pergunta</label>
                      <input
                        type="text"
                        value={currentQ.title}
                        onChange={(e) => handleUpdateQuestion('title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium">Subtítulo / Instrução</label>
                      <input
                        type="text"
                        value={currentQ.subtitle || ''}
                        onChange={(e) => handleUpdateQuestion('subtitle', e.target.value)}
                        placeholder="Ex: Selecione a opção que melhor descreve seu caso"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Options Editor (for Multiple Choice) */}
                    {currentQ.type === 'multiple_choice' && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-300">Opções de Escolha:</label>
                          <button
                            type="button"
                            onClick={handleAddOption}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Adicionar Opção</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {(currentQ.options || []).map((opt, optIdx) => (
                            <div key={opt.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt.icon || '⭐'}
                                  onChange={(e) => handleUpdateOption(optIdx, 'icon', e.target.value)}
                                  className="w-10 text-center py-1 rounded bg-slate-900 border border-slate-700 text-sm outline-none"
                                  title="Emoji ou Ícone"
                                />
                                <input
                                  type="text"
                                  value={opt.label}
                                  onChange={(e) => handleUpdateOption(optIdx, 'label', e.target.value)}
                                  placeholder="Texto da Opção"
                                  className="flex-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-amber-500 font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOption(optIdx)}
                                  className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                                  title="Remover opção"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <input
                                type="text"
                                value={opt.subtitle || ''}
                                onChange={(e) => handleUpdateOption(optIdx, 'subtitle', e.target.value)}
                                placeholder="Subtítulo ou detalhe (opcional)"
                                className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* TAB 2: THEME & VISUALS */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                
                {/* Brand Color Palettes */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="text-xs font-bold text-slate-200">Cor Primária da Marca do Cliente</label>
                  <p className="text-[11px] text-slate-400">Clique para aplicar instantaneamente na prévia:</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {[
                      { name: 'Dourado Legado', color: '#c58e41' },
                      { name: 'Laranja Real Pisos', color: '#f97316' },
                      { name: 'Azul Corporativo', color: '#2563eb' },
                      { name: 'Verde Esmeralda', color: '#10b981' },
                      { name: 'Roxo Moderno', color: '#8b5cf6' },
                      { name: 'Vermelho Intenso', color: '#ef4444' },
                    ].map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setForm({
                          ...form,
                          theme: { ...form.theme, primaryColor: p.color }
                        })}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                          form.theme?.primaryColor === p.color 
                            ? 'border-white bg-slate-800 ring-1 ring-white' 
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="font-medium truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                    <span className="text-xs text-slate-400">Personalizado:</span>
                    <input
                      type="color"
                      value={form.theme?.primaryColor || '#c58e41'}
                      onChange={(e) => setForm({
                        ...form,
                        theme: { ...form.theme, primaryColor: e.target.value }
                      })}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.theme?.primaryColor || '#c58e41'}
                      onChange={(e) => setForm({
                        ...form,
                        theme: { ...form.theme, primaryColor: e.target.value }
                      })}
                      className="w-24 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                {/* Social Proof Badge */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Selo de Prova Social no Topo</label>
                    <span className="text-[10px] text-emerald-400 font-bold">Aumenta Conversão</span>
                  </div>
                  <input
                    type="text"
                    value={form.theme?.socialProofBadge || ''}
                    onChange={(e) => setForm({
                      ...form,
                      theme: { ...form.theme, socialProofBadge: e.target.value }
                    })}
                    placeholder="Ex: ⭐ + de 250 Empresas Estruturadas"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Progress Bar Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-slate-200">Exibir Barra de Progresso</div>
                    <div className="text-[11px] text-slate-400">Mostra a porcentagem de avanço no topo</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.theme?.showProgressBar ?? true}
                    onChange={(e) => setForm({
                      ...form,
                      theme: { ...form.theme, showProgressBar: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>

              </div>
            )}

            {/* TAB 3: WHATSAPP & THANK YOU */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                
                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="text-xs font-bold text-slate-200">WhatsApp Comercial de Destino</label>
                  <p className="text-[11px] text-slate-400">Número do vendedor ou atendente com DDI e DDD:</p>
                  <input
                    type="text"
                    value={form.thankYouScreen?.whatsappNumber || ''}
                    onChange={(e) => setForm({
                      ...form,
                      thankYouScreen: { ...form.thankYouScreen, whatsappNumber: e.target.value }
                    })}
                    placeholder="5511999999999"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-amber-400 font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="text-xs font-bold text-slate-200">Título da Tela de Obrigado</label>
                  <input
                    type="text"
                    value={form.thankYouScreen?.title || ''}
                    onChange={(e) => setForm({
                      ...form,
                      thankYouScreen: { ...form.thankYouScreen, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="text-xs font-bold text-slate-200">Texto do Botão CTA de Ação</label>
                  <input
                    type="text"
                    value={form.thankYouScreen?.ctaText || ''}
                    onChange={(e) => setForm({
                      ...form,
                      thankYouScreen: { ...form.thankYouScreen, ctaText: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="text-xs font-bold text-slate-200">Template da Mensagem no WhatsApp</label>
                  <p className="text-[11px] text-slate-400">Use {'{nome}'} para puxar o nome do lead automaticamente:</p>
                  <textarea
                    value={form.thankYouScreen?.whatsappMessageTemplate || ''}
                    onChange={(e) => setForm({
                      ...form,
                      thankYouScreen: { ...form.thankYouScreen, whatsappMessageTemplate: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right Side: Live Smartphone Mockup with Bi-directional Sync */}
        <div className="flex-1 bg-[#05070a] p-4 sm:p-8 flex flex-col items-center justify-center overflow-y-auto">
          
          {/* Mockup Mode Toggle */}
          <div className="flex items-center gap-2 mb-4 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setPreviewMode('sync')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                previewMode === 'sync' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👁️ Sincronizado com a Pergunta ({selectedQuestionIndex + 1})
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('interactive')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                previewMode === 'interactive' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ Testar Fluxo Completo
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="w-[360px] sm:w-[390px] h-[720px] rounded-[42px] border-[8px] border-slate-800 bg-[#0e121b] shadow-2xl shadow-black/95 overflow-hidden flex flex-col relative">
            
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto z-20 flex-shrink-0" />

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <QuizPlayer 
                form={form} 
                isEmbed={true}
                forcedStepIndex={previewMode === 'sync' ? selectedQuestionIndex : undefined}
                onStepChange={(newStep) => {
                  if (previewMode === 'sync') {
                    setSelectedQuestionIndex(newStep)
                  }
                }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
