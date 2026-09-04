'use client'

import React, { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { getFormById } from '@/lib/storage'
import { QuizForm } from '@/types/quiz'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'

export default function PublicQuizPage() {
  const params = useParams()
  const id = params?.id as string

  const [form, setForm] = useState<QuizForm | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const f = getFormById(id)
      setForm(f || null)
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#07090e] text-slate-400 text-sm">
        Carregando formulário...
      </main>
    )
  }

  if (!form) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#07090e] text-slate-400 text-sm">
        Formulário não encontrado.
      </main>
    )
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 selection:bg-amber-500/20 selection:text-amber-300"
      style={{ backgroundColor: form.theme.backgroundColor || '#07090e' }}
    >
      <div 
        className="w-full max-w-md rounded-2xl border shadow-2xl shadow-black/80 overflow-hidden"
        style={{ 
          backgroundColor: form.theme.cardBackground || '#0e121b',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <QuizPlayer form={form} />
      </div>
    </main>
  )
}
