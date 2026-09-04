import { notFound } from 'next/navigation'
import { mockForms } from '@/data/mockQuizzes'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function QuizPage({ params }: PageProps) {
  const { id } = await params
  const form = mockForms.find(f => f.id === id)

  if (!form) {
    return notFound()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#07090e] p-2 sm:p-4 selection:bg-amber-500/20 selection:text-amber-300">
      <div className="w-full max-w-md rounded-2xl bg-[#0e121b] border border-slate-800/80 shadow-2xl shadow-black/60 overflow-hidden">
        <QuizPlayer form={form} />
      </div>
    </main>
  )
}
