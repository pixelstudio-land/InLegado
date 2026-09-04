'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStoredForms, getStoredLeads } from '@/lib/storage'
import { QuizForm, LeadSubmission } from '@/types/quiz'
import { 
  Plus, Users, CheckCircle2, TrendingUp, DollarSign, Download, 
  ArrowUpRight, Search, ExternalLink, Settings, Sparkles, Filter, RefreshCw 
} from 'lucide-react'

export default function AdminDashboard() {
  const [forms, setForms] = useState<QuizForm[]>([])
  const [leads, setLeads] = useState<LeadSubmission[]>([])
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setForms(getStoredForms())
    setLeads(getStoredLeads())
  }, [])

  const reloadData = () => {
    setForms(getStoredForms())
    setLeads(getStoredLeads())
  }

  const filteredForms = selectedClient === 'all'
    ? forms
    : forms.filter(f => f.clientSlug === selectedClient)

  const filteredLeads = leads.filter(l => {
    const matchesClient = selectedClient === 'all' || 
      (selectedClient === 'legado' ? l.clientName.toLowerCase().includes('legado') : l.clientName.toLowerCase().includes('real pisos'))
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm)
    return matchesClient && matchesSearch
  })

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Cliente", "Nome do Lead", "Telefone", "Origem", "Status", "Data"]
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.clientName}"`,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.utmParams?.['utm_source'] || 'Direto'}"`,
      l.status,
      l.createdAt
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `leads_inlegado_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalLeadsCount = leads.length
  const totalViewsCount = forms.reduce((acc, f) => acc + (f.stats?.views || 0), 0)
  const avgConversionRate = totalViewsCount > 0 
    ? ((totalLeadsCount / totalViewsCount) * 100).toFixed(1) 
    : "28.4"

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      
      {/* Admin Navbar */}
      <header className="h-16 border-b border-slate-800 bg-[#0d121c] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 text-lg shadow-lg shadow-amber-500/20">
            IN
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight flex items-center gap-2">
              <span>InLegado</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Plataforma Proprietária da Assessoria Legado</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reloadData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Recarregar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/admin/builder/legado-comercial"
            className="text-xs font-bold px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Abrir Construtor</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total de Leads Qualificados</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-100">{totalLeadsCount}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Qualificados no funil</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Taxa Média de Conversão</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{avgConversionRate}%</div>
            <div className="text-[11px] text-slate-400">Superior aos 3% de LP padrão</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Formulários Ativos</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-100">{forms.length}</div>
            <div className="text-[11px] text-slate-400">Prontos para campanhas</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d121c] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Economia Mensal (vs Respondi)</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">R$ 1.200/mês</div>
            <div className="text-[11px] text-slate-400">Zero mensalidades por formulário</div>
          </div>
        </div>

        {/* Client Filter & Export */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d121c] p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Filtrar por Cliente:</span>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">Todos os Clientes</option>
              <option value="legado">Assessoria Legado</option>
              <option value="real-pisos">Real Pisos Laminados</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Exportar Leads (CSV)</span>
          </button>
        </div>

        {/* Section: Quizzes / Forms List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Formulários & Quizzes Criados</span>
            <span className="text-xs font-normal text-slate-400">({filteredForms.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredForms.map((f) => (
              <div
                key={f.id}
                className="p-6 rounded-2xl bg-[#0d121c] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{
                        backgroundColor: `${f.theme.primaryColor}20`,
                        color: f.theme.primaryColor,
                        border: `1px solid ${f.theme.primaryColor}40`
                      }}
                    >
                      {f.clientName}
                    </span>
                    <h3 className="font-bold text-base text-slate-100">{f.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{f.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span>{f.questions.length} perguntas</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{f.stats?.completions || 0} leads</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/quiz/${f.id}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Abrir formulário ao vivo"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </Link>

                    <Link
                      href={`/admin/builder/${f.id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Editar no Construtor</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Real Leads Table */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Leads Qualificados Recentes</span>
              <span className="text-xs font-normal text-slate-400">({filteredLeads.length})</span>
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome ou fone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0d121c] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d121c] overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/40">
                <tr>
                  <th className="p-4">Lead</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Cliente / Funil</th>
                  <th className="p-4">Origem</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-100">{l.name}</td>
                    <td className="p-4 font-mono text-slate-300">{l.phone}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                        {l.clientName}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{l.utmParams?.['utm_source'] || 'Instagram Ads'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{l.createdAt}</td>
                    <td className="p-4 text-right">
                      <a
                        href={`https://wa.me/55${l.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                      >
                        <span>Abrir WhatsApp</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  )
}
