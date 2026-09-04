'use client'

import React, { useState, useEffect } from 'react'
import { QuizForm, QuizQuestion, QuizOption } from '@/types/quiz'
import { formatPhone } from '@/lib/utils'
import { ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Send } from 'lucide-react'
import confetti from 'canvas-confetti'

interface QuizPlayerProps {
  form: QuizForm
  isEmbed?: boolean
}

export function QuizPlayer({ form, isEmbed = false }: QuizPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [textInput, setTextInput] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [history, setHistory] = useState<number[]>([0])
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Capture UTM parameters from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const utms: Record<string, string> = {}
      params.forEach((value, key) => {
        if (key.startsWith('utm_') || key === 'src' || key === 'sck') {
          utms[key] = value
        }
      })
      setUtmParams(utms)
    }
  }, [])

  const currentQuestion = form.questions[currentStepIndex]
  const totalQuestions = form.questions.length
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / totalQuestions) * 100))

  // Trigger confetti on completion
  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isCompleted])

  const handleNextStep = (nextId?: string) => {
    if (nextId) {
      const targetIndex = form.questions.findIndex(q => q.id === nextId)
      if (targetIndex !== -1) {
        setHistory(prev => [...prev, targetIndex])
        setCurrentStepIndex(targetIndex)
        setTextInput('')
        return
      }
    }

    if (currentStepIndex < totalQuestions - 1) {
      const nextIndex = currentStepIndex + 1
      setHistory(prev => [...prev, nextIndex])
      setCurrentStepIndex(nextIndex)
      setTextInput('')
    } else {
      finishQuiz()
    }
  }

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history]
      newHistory.pop()
      const prevIndex = newHistory[newHistory.length - 1]
      setHistory(newHistory)
      setCurrentStepIndex(prevIndex)
      setTextInput('')
    }
  }

  const handleOptionSelect = (option: QuizOption) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: option.label
    }
    setAnswers(updatedAnswers)

    // Smooth transition with small delay for visual feedback
    setTimeout(() => {
      handleNextStep(option.nextQuestionId || currentQuestion.nextQuestionId)
    }, 280)
  }

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!textInput.trim()) return

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: textInput.trim()
    }
    setAnswers(updatedAnswers)
    handleNextStep(currentQuestion.nextQuestionId)
  }

  const finishQuiz = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsCompleted(true)
    }, 600)
  }

  const leadName = answers['q4'] || answers['piso_contato_nome'] || answers['nome'] || 'Cliente'
  const leadPhone = answers['q5'] || answers['piso_contato_tel'] || answers['telefone'] || ''

  // Build WhatsApp Link
  const buildWhatsAppUrl = () => {
    const phone = form.thankYouScreen.whatsappNumber || '5511999999999'
    let msg = form.thankYouScreen.whatsappMessageTemplate || 'Olá! Acabei de preencher o formulário no InLegado.'
    msg = msg.replace('{nome}', leadName)
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="w-full max-w-lg mx-auto min-h-[620px] flex flex-col justify-between p-4 sm:p-6 transition-all duration-300">
      
      {/* Top Header & Social Proof */}
      <div className="space-y-4">
        {form.theme.socialProofBadge && !isCompleted && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm animate-pulse-subtle">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{form.theme.socialProofBadge}</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {form.theme.showProgressBar && !isCompleted && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1">
                {history.length > 1 && (
                  <button 
                    onClick={handleBack}
                    className="p-1 -ml-1 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Voltar pergunta"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                <span>Pergunta {currentStepIndex + 1} de {totalQuestions}</span>
              </div>
              <span className="text-amber-400 font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-6">
        {!isCompleted ? (
          <div className="space-y-6 animate-fade-in key={currentQuestion.id}">
            
            {/* Question Title & Subtitle */}
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === opt.label
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt)}
                      className={`group relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 shadow-sm ${
                        isSelected 
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500' 
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 pr-2">
                        {opt.icon && (
                          <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            {opt.icon}
                          </span>
                        )}
                        <div>
                          <div className="font-medium text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                            {opt.label}
                          </div>
                          {opt.subtitle && (
                            <div className="text-xs text-slate-400 mt-0.5">
                              {opt.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-block text-[11px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-700 group-hover:border-slate-500'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Text & Phone Inputs */}
            {(currentQuestion.type === 'text' || currentQuestion.type === 'phone' || currentQuestion.type === 'number') && (
              <form onSubmit={handleTextSubmit} className="space-y-4 pt-2">
                <div>
                  <input
                    type={currentQuestion.type === 'phone' ? 'tel' : currentQuestion.type === 'number' ? 'number' : 'text'}
                    autoFocus
                    value={textInput}
                    onChange={(e) => {
                      if (currentQuestion.type === 'phone') {
                        setTextInput(formatPhone(e.target.value))
                      } else {
                        setTextInput(e.target.value)
                      }
                    }}
                    placeholder={currentQuestion.placeholder || 'Digite sua resposta aqui...'}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-100 placeholder-slate-500 text-lg outline-none transition-all"
                  />
                  {currentQuestion.helpText && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      {currentQuestion.helpText}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all duration-200"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        ) : (
          /* Thank You Screen (Conversion Screen) */
          <div className="space-y-6 text-center animate-slide-up py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                {form.thankYouScreen.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                {form.thankYouScreen.subtitle}
              </p>
            </div>

            {/* Summary Card */}
            {form.thankYouScreen.showSummary && Object.keys(answers).length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left max-w-sm mx-auto text-xs space-y-1.5 text-slate-300 shadow-sm">
                <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800 flex justify-between items-center">
                  <span>Resumo do Atendimento</span>
                  <span className="text-emerald-400 font-bold">Qualificado</span>
                </div>
                {leadName && <div><strong>Nome:</strong> {leadName}</div>}
                {leadPhone && <div><strong>WhatsApp:</strong> {leadPhone}</div>}
              </div>
            )}

            {/* WhatsApp CTA Button */}
            <div className="pt-2">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{form.thankYouScreen.ctaText}</span>
              </a>
              <p className="text-[11px] text-slate-500 mt-2">
                🔒 Seus dados estão seguros e serão utilizados apenas para este atendimento.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-500">
        <span>InLegado © {new Date().getFullYear()}</span>
        <span className="flex items-center gap-1 font-medium text-slate-400">
          Powered by <strong className="text-amber-400">Legado</strong>
        </span>
      </div>

    </div>
  )
}
