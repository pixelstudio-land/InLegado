'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { mockForms, mockSubmissions } from '@/data/mockQuizzes'
import { Plus, Users, CheckCircle2, TrendingUp, DollarSign, Download, ArrowUpRight, Search, ExternalLink, Settings, ShieldAlert, Sparkles, Filter } from 'lucide-react'

export default function AdminDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredForms = selectedClient === 'all'
    ? mockForms
    : mockForms.filter(f => f.clientSlug === selectedClient)

  const filteredLeads = mockSubmissions.filter(l => {
    const matchesClient = selectedClient === 'all' || (selectedClient === 'legado' ? l.clientName.includes('Legado') : l.clientName.includes('Real Pisos'))
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm)
    return matchesClient && matchesSearch
  })

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Cliente", "Nome do Lead", "Telefone", "Origem", "Status", "Data"]
    const rows = filteredLeads.map(l => [
      l.id,
      l.clientName,
      l.name,
      l.phone,
      l.utmParams['utm_source'] || 'Direto',
      l.status,
      l.createdAt
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `leads_inlegado_${selectedClient}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100">
      
      {/* Admin Top Header */}
      <header className="border-b border-slate-800 bg-[#0d111a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm">
                IN
              </div>
              <span className="font-bold text-base tracking-tight text-slate-100">InLegado Admin</span>
            </Link>

            <span className="hidden sm:inline-block text-slate-600">/</span>

            {/* Multi-client selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Cliente:</span>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:border-amber-500 outline-none cursor-pointer"
              >
                <option value="all">🏢 Todos os Clientes da Legado</option>
                <option value="legado">👑 Assessoria Legado (Próprio)</option>
                <option value="real-pisos">🪵 Real Pisos Laminados</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Voltar ao Portal
            </Link>

            <button 
              onClick={() => alert("Criador de novo formulário ativado!")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Quiz</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total de Leads Capturados</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-100">1.126</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% essa semana</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Taxa Média de Conclusão</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-100">27.8%</div>
            <div className="text-[11px] text-slate-400">Muito acima da média de LPs (12%)</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Quizzes Ativos</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-100">{filteredForms.length}</div>
            <div className="text-[11px] text-slate-400">Campanhas rodando no ar</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Economia com Respondi/Inlead</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">R$ 5.940,00</div>
            <div className="text-[11px] text-slate-400">Economia anual estimada</div>
          </div>
        </div>

        {/* Quizzes Management List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Formulários & Quizzes Ativos</h2>
              <p className="text-xs text-slate-400">Gerencie as perguntas, lógica e links de tráfego:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="p-5 rounded-2xl bg-[#0d121c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      {form.clientName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {form.stats.leads} leads capturados
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-100">{form.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{form.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/quiz/${form.id}`}
                    target="_blank"
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <span>Abrir Link Público</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/admin/builder/${form.id}`}
                    className="text-xs text-slate-950 font-bold flex items-center gap-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Editar no Construtor</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real-Time Leads Inbox Table */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Leads Capturados em Tempo Real</h2>
              <p className="text-xs text-slate-400">Visualize as respostas e envie direto para o CRM da Legado:</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar lead por nome ou tel..."
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500 w-56"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d121c] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Nome do Lead</th>
                    <th className="py-3 px-4">WhatsApp</th>
                    <th className="py-3 px-4">Empresa / Cliente</th>
                    <th className="py-3 px-4">Origem / Anúncio</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-100">{lead.name}</td>
                      <td className="py-3 px-4 text-amber-300 font-mono">{lead.phone}</td>
                      <td className="py-3 px-4">{lead.clientName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {lead.utmParams['utm_source'] || 'Campanha Meta'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          lead.status === 'Convertido' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          lead.status === 'Em Atendimento' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{lead.createdAt}</td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                          <span>Chamar no Whats</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

    </div>
  )
}
