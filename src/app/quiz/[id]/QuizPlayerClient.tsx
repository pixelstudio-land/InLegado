'use client'

import React, { useState, useEffect } from 'react'
import { QuizForm } from '@/types/quiz'
import { getFormById } from '@/lib/storage'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'

interface QuizPlayerClientProps {
  formId: string
  initialForm: QuizForm
}

export function QuizPlayerClient({ formId, initialForm }: QuizPlayerClientProps) {
  // Start immediately with initialForm - NEVER STUCK ON LOADING!
  const [form, setForm] = useState<QuizForm>(initialForm)

  // On client, check if there are saved edits in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && formId) {
      try {
        const stored = getFormById(formId)
        if (stored) {
          setForm(stored)
        }
      } catch (e) {
        console.error('Error reading form from storage:', e)
      }
    }
  }, [formId])

  return <QuizPlayer form={form} />
}
