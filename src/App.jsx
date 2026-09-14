import { useState } from 'react'
import { usePokerStore } from './lib/store.js'
import { useAuth } from './lib/auth.js'
import AuthScreen from './components/AuthScreen.jsx'
import Header from './components/Header.jsx'
import EntryForm from './components/EntryForm.jsx'
import ExitForm from './components/ExitForm.jsx'
import TournamentOptions from './components/TournamentOptions.jsx'
import MovementsReport from './components/MovementsReport.jsx'
import PlayerBalancesPanel from './components/PlayerBalancesPanel.jsx'
import PlayerMovementsModal from './components/PlayerMovementsModal.jsx'
import RakeRegistry from './components/RakeRegistry.jsx'
import SummaryModal from './components/SummaryModal.jsx'
import ArchiveModal from './components/ArchiveModal.jsx'
import TicketModal from './components/TicketModal.jsx'
import HistoryView from './components/HistoryView.jsx'
import { Button, Toast } from './components/ui.jsx'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const store = usePokerStore(user?.id)
  const [view, setView] = useState('main') // main | history
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [toast, setToast] = useState(null)

  if (authLoading) return null

  if (!user) {
    return <AuthScreen signIn={signIn} signUp={signUp} />
  }

  function notify(message, type = 'ok') {
    setToast({ message, type })
    window.clearTimeout(notify._t)
    notify._t = window.setTimeout(() => setToast(null), 2600)
  }

  function handleToggleView(target) {
    if (target === 'archive') {
      setArchiveOpen(true)
      return
    }
    setView(target === view ? 'main' : target)
  }

  async function confirmArchive() {
    const result = await store.archiveSession()
    if (!result.ok) return notify(result.error, 'error')
    setArchiveOpen(false)
    notify('Sesión archivada y reiniciada.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        clubName={store.clubName}
        onClubNameChange={store.setClubName}
        view={view}
        onToggleView={handleToggleView}
        netoNow={store.totals.neto}
        userEmail={user.email}
        onSignOut={signOut}
      />

      {view === 'main' ? (
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 sm:px-8 py-7">
          <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
            <div className="space-y-6">
              <TournamentOptions
                tournamentTag={store.session.tournamentTag}
                onChange={store.setTournamentTag}
              />
              <EntryForm
                addEntry={store.addEntry}
                ticketCounter={store.session.ticketCounter}
                tournamentTag={store.session.tournamentTag}
                onSuccess={(m) => notify(`Ingreso registrado para ${m.name}.`)}
              />
              <ExitForm
                addExit={store.addExit}
                ticketCounter={store.session.ticketCounter}
                tournamentTag={store.session.tournamentTag}
                onSuccess={(m) => notify(`Salida registrada para ${m.name}.`)}
              />
              <RakeRegistry rake={store.session.rake} addRake={store.addRake} removeRake={store.removeRake} />

              <Button variant="brass" className="w-full" onClick={() => setSummaryOpen(true)}>
                Resumir sesión ✦
              </Button>
            </div>

            <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-140px)] flex flex-col gap-4">
              <div className="flex-1 min-h-0">
                <MovementsReport
                  movements={store.session.movements}
                  totals={store.totals}
                  clubName={store.clubName}
                  members={store.members}
                  onPrint={(m) => setTicket(m)}
                />
              </div>
              <div className="shrink-0">
                <PlayerBalancesPanel summaryByMember={store.summaryByMember} onSelectPlayer={setSelectedPlayer} />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <HistoryView
          archivedDayKeys={store.archivedDayKeys}
          getDayReport={store.getDayReport}
          onBack={() => setView('main')}
        />
      )}

      <SummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        summaryByMember={store.summaryByMember}
        totals={store.totals}
        clubName={store.clubName}
      />

      <ArchiveModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        onConfirm={confirmArchive}
      />
      

      <TicketModal movement={ticket} clubName={store.clubName} onClose={() => setTicket(null)} />
      <PlayerMovementsModal
        playerName={selectedPlayer}
        movements={store.session.movements}
        onClose={() => setSelectedPlayer(null)}
      />

      <Toast toast={toast} />
    </div>
  )
}
