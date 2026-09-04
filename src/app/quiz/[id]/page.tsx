import { notFound } from 'next/navigation'
import { getFormById } from '@/lib/storage'
import { mockForms } from '@/data/mockQuizzes'
import { QuizPlayerClient } from './QuizPlayerClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicQuizPage({ params }: PageProps) {
  const { id } = await params
  
  // Resolve initial form immediately on server with zero loading screen
  const initialForm = getFormById(id) || mockForms.find(f => f.id === id) || mockForms[0]

  if (!initialForm) {
    return notFound()
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 selection:bg-amber-500/20 selection:text-amber-300"
      style={{ backgroundColor: initialForm.theme?.backgroundColor || '#07090e' }}
    >
      <div 
        className="w-full max-w-md rounded-2xl border shadow-2xl shadow-black/80 overflow-hidden"
        style={{ 
          backgroundColor: initialForm.theme?.cardBackground || '#0e121b',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <QuizPlayerClient formId={id} initialForm={initialForm} />
      </div>
    </main>
  )
}
