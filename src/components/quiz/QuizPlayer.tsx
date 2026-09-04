'use client'

import React, { useState, useEffect } from 'react'
import { QuizForm, QuizQuestion, QuizOption } from '@/types/quiz'
import { formatPhone } from '@/lib/utils'
import { saveLead } from '@/lib/storage'
import { ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react'
import confetti from 'canvas-confetti'

interface QuizPlayerProps {
  form: QuizForm
  isEmbed?: boolean
  forcedStepIndex?: number // Allows builder preview to jump directly to any question
  onStepChange?: (stepIndex: number) => void // Notifies builder when step changes
}

export function QuizPlayer({ form, isEmbed = false, forcedStepIndex, onStepChange }: QuizPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [textInput, setTextInput] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [history, setHistory] = useState<number[]>([0])
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null)

  // Dynamic theme colors
  const primaryColor = form.theme.primaryColor || '#c58e41'
  const bgColor = form.theme.backgroundColor || '#0b0e14'
  const cardBg = form.theme.cardBackground || '#131822'
  const textColor = form.theme.textColor || '#ffffff'

  // Capture UTM parameters from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const utms: Record<string, string> = {}
      urlParams.forEach((value, key) => {
        if (key.startsWith('utm_')) {
          utms[key] = value
        }
      })
      setUtmParams(utms)
    }
  }, [])

  // Sync with builder preview if forcedStepIndex is provided
  useEffect(() => {
    if (typeof forcedStepIndex === 'number' && forcedStepIndex >= 0 && forcedStepIndex < form.questions.length) {
      setCurrentStepIndex(forcedStepIndex)
      setIsCompleted(false)
      setSelectedOptId(null)
      setTextInput('')
    }
  }, [forcedStepIndex, form.questions.length])

  // Trigger confetti on completion
  useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        })
      } catch {}
    }
  }, [isCompleted])

  const safeStepIndex = Math.min(Math.max(0, currentStepIndex), Math.max(0, form.questions.length - 1))
  const currentQuestion: QuizQuestion | undefined = form.questions[safeStepIndex]
  const totalQuestions = form.questions.length
  const progressPercent = totalQuestions > 0 ? Math.min(100, Math.round(((safeStepIndex + 1) / totalQuestions) * 100)) : 100

  const handleNextStep = (nextId?: string) => {
    setSelectedOptId(null)

    if (nextId) {
      const targetIndex = form.questions.findIndex(q => q.id === nextId)
      if (targetIndex !== -1) {
        setHistory(prev => [...prev, targetIndex])
        setCurrentStepIndex(targetIndex)
        onStepChange?.(targetIndex)
        setTextInput('')
        return
      }
    }

    if (safeStepIndex < totalQuestions - 1) {
      const nextIndex = safeStepIndex + 1
      setHistory(prev => [...prev, nextIndex])
      setCurrentStepIndex(nextIndex)
      onStepChange?.(nextIndex)
      setTextInput('')
    } else {
      finishQuiz()
    }
  }

  const handleBack = () => {
    setSelectedOptId(null)
    if (history.length > 1) {
      const newHistory = [...history]
      newHistory.pop()
      const prevIndex = newHistory[newHistory.length - 1]
      setHistory(newHistory)
      setCurrentStepIndex(prevIndex)
      onStepChange?.(prevIndex)
      setTextInput('')
    } else if (safeStepIndex > 0) {
      const prevIndex = safeStepIndex - 1
      setCurrentStepIndex(prevIndex)
      onStepChange?.(prevIndex)
      setTextInput('')
    }
  }

  const handleOptionSelect = (option: QuizOption) => {
    if (!currentQuestion || selectedOptId) return

    setSelectedOptId(option.id)
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: option.label
    }
    setAnswers(updatedAnswers)

    const nextTarget = option.nextQuestionId || currentQuestion.nextQuestionId

    // 140ms snappy transition with visible active state
    setTimeout(() => {
      handleNextStep(nextTarget)
    }, 140)
  }

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!textInput.trim() || !currentQuestion) return

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: textInput.trim()
    }
    setAnswers(updatedAnswers)
    handleNextStep(currentQuestion.nextQuestionId)
  }

  const finishQuiz = () => {
    setIsCompleted(true)
    const leadName = answers.q4 || answers.nome || answers.name || Object.values(answers)[0] || 'Lead Qualificado'
    const leadPhone = answers.q5 || answers.telefone || answers.whatsapp || answers.phone || '(11) 99999-9999'

    // Save lead to storage
    saveLead({
      id: `lead_${Date.now()}`,
      formId: form.id,
      clientName: form.clientName,
      name: String(leadName),
      phone: String(leadPhone),
      answers: answers,
      utmParams: utmParams,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      formTitle: form.title,
      status: 'Novo'
    })
  }

  const handleRestart = () => {
    setCurrentStepIndex(0)
    setHistory([0])
    setAnswers({})
    setTextInput('')
    setSelectedOptId(null)
    setIsCompleted(false)
    onStepChange?.(0)
  }

  // Build WhatsApp URL with qualification summary
  const buildWhatsAppUrl = () => {
    const rawNumber = form.thankYouScreen.whatsappNumber || '5511999999999'
    const cleanNumber = rawNumber.replace(/\D/g, '')
    
    let message = form.thankYouScreen.whatsappMessageTemplate || 
      'Olá! Acabei de responder ao formulário {nome} e gostaria de prosseguir com o atendimento.'

    const leadName = answers.q4 || answers.nome || answers.name || Object.values(answers)[0] || 'Cliente'
    message = message.replace(/{nome}/g, String(leadName))

    const summaryLines = Object.entries(answers)
      .map(([_, val]) => `• ${val}`)
      .join('\n')

    const fullMessage = `${message}\n\n*Resumo das respostas:*\n${summaryLines}`

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(fullMessage)}`
  }

  const leadName = answers.q4 || answers.nome || answers.name
  const leadPhone = answers.q5 || answers.telefone || answers.whatsapp

  return (
    <div 
      className={`w-full min-h-[580px] flex flex-col justify-between p-4 sm:p-7 relative transition-colors duration-300 ${
        isEmbed ? 'bg-transparent' : ''
      }`}
      style={{
        backgroundColor: isEmbed ? 'transparent' : bgColor,
        color: textColor,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header Area */}
      <div className="space-y-3">
        {/* Top Badges & Progress */}
        <div className="flex items-center justify-between text-xs">
          {/* Back Button */}
          {safeStepIndex > 0 && !isCompleted ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity text-xs font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <span />
          )}

          {/* Social Proof Badge */}
          {form.theme.socialProofBadge && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{form.theme.socialProofBadge}</span>
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        {form.theme.showProgressBar && !isCompleted && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] opacity-60 font-semibold">
              <span>Pergunta {safeStepIndex + 1} de {totalQuestions}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%`, backgroundColor: primaryColor }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-6">
        {!isCompleted && currentQuestion ? (
          <div key={currentQuestion.id} className="space-y-6 animate-fade-in">
            
            {/* Question Title & Subtitle */}
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-sm opacity-75 leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOptId === opt.id || answers[currentQuestion.id] === opt.label
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionSelect(opt)}
                      className="group relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-150 shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        backgroundColor: isSelected ? `${primaryColor}25` : cardBg,
                        borderColor: isSelected ? primaryColor : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? primaryColor : textColor
                      }}
                    >
                      <div className="flex items-center gap-3.5 pr-2">
                        {opt.icon && (
                          <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            {opt.icon}
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-base">
                            {opt.label}
                          </div>
                          {opt.subtitle && (
                            <div className="text-xs opacity-70 mt-0.5">
                              {opt.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-block text-[11px] opacity-40 border border-slate-700 rounded px-1.5 py-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <div 
                          className="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                          style={{
                            borderColor: isSelected ? primaryColor : 'rgba(255, 255, 255, 0.2)',
                            backgroundColor: isSelected ? primaryColor : 'transparent'
                          }}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Text, Phone & Number Inputs */}
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
                    className="w-full px-4 py-3.5 rounded-xl border focus:ring-2 text-lg outline-none transition-all placeholder:opacity-40"
                    style={{
                      backgroundColor: cardBg,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      color: textColor
                    }}
                  />
                  {currentQuestion.helpText && (
                    <p className="text-xs opacity-60 mt-1.5">
                      {currentQuestion.helpText}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#07090e'
                  }}
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
            <div 
              className="w-16 h-16 mx-auto rounded-full border flex items-center justify-center shadow-inner"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#10b981'
              }}
            >
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                {form.thankYouScreen.title}
              </h2>
              <p className="opacity-80 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                {form.thankYouScreen.subtitle}
              </p>
            </div>

            {/* Summary Card */}
            {form.thankYouScreen.showSummary && Object.keys(answers).length > 0 && (
              <div 
                className="p-4 rounded-xl border text-left max-w-sm mx-auto text-xs space-y-1.5 shadow-sm"
                style={{
                  backgroundColor: cardBg,
                  borderColor: 'rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="font-semibold opacity-60 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800 flex justify-between items-center">
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
              <p className="text-[11px] opacity-50 mt-2">
                🔒 Seus dados estão seguros e serão utilizados apenas para este atendimento.
              </p>
            </div>

            {/* Restart button for testing */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refazer teste do início</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-[11px] opacity-50">
        <span>InLegado © {new Date().getFullYear()}</span>
        <span className="flex items-center gap-1 font-medium">
          Powered by <strong style={{ color: primaryColor }}>Legado</strong>
        </span>
      </div>

    </div>
  )
}
