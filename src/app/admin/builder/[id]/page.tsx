import { notFound } from 'next/navigation'
import { getFormById } from '@/lib/storage'
import { mockForms } from '@/data/mockQuizzes'
import { BuilderClient } from './BuilderClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function QuizBuilderPage({ params }: PageProps) {
  const { id } = await params
  const initialForm = getFormById(id) || mockForms.find(f => f.id === id) || mockForms[0]

  if (!initialForm) {
    return notFound()
  }

  return <BuilderClient formId={id} initialForm={initialForm} />
}
