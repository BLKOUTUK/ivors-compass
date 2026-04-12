import { type ReactNode } from 'react'
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { CompassProvider, useCompass } from './hooks/useCompass'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import ClaimPage from './pages/ClaimPage'
import WaitlistPage from './pages/WaitlistPage'
import InstallationPage from './pages/InstallationPage'
import InterviewFeedbackPage from './pages/InterviewFeedbackPage'
import UnlockPage from './pages/UnlockPage'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import MeditationPage from './pages/MeditationPage'
import CardsPage from './pages/CardsPage'
import FilmPage from './pages/FilmPage'
import JournalPage from './pages/JournalPage'
import JournalPageV2 from './pages/JournalPageV2'
import AboutPage from './pages/AboutPage'
import CrisisPage from './pages/CrisisPage'
import MoodTrackerPage from './pages/MoodTrackerPage'
import WorkshopsPage from './pages/WorkshopsPage'
import SunroomPage from './pages/SunroomPage'
import ProgressPage from './pages/ProgressPage'
import ConvergencePage from './pages/ConvergencePage'
import InterviewPage from './pages/InterviewPage'
import LifeOfIvorPage from './pages/LifeOfIvorPage'
import RecordPage from './pages/RecordPage'

/** Switch between the new course-based journal and the classic list.
 *  Use ?classic=1 to fall back to the old journal instantly. */
function JournalRouter() {
  const [searchParams] = useSearchParams()
  if (searchParams.get('classic') === '1') {
    return <JournalPage />
  }
  return <JournalPageV2 />
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isUnlocked } = useCompass()
  if (!isUnlocked) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { isUnlocked } = useCompass()

  return (
    <Routes>
      <Route
        path="/"
        element={isUnlocked ? <Navigate to="/welcome" replace /> : <LandingPage />}
      />
      <Route path="/claim" element={<ClaimPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route
        path="/unlock"
        element={isUnlocked ? <Navigate to="/welcome" replace /> : <UnlockPage />}
      />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/compass" element={<HomePage />} />
        <Route path="/compass/convergence" element={<ConvergencePage />} />
        <Route path="/compass/meditation/:id" element={<MeditationPage />} />
        <Route path="/compass/cards" element={<CardsPage />} />
        <Route path="/compass/film" element={<FilmPage />} />
        <Route path="/compass/journal" element={<JournalRouter />} />
        <Route path="/compass/mood" element={<MoodTrackerPage />} />
        <Route path="/compass/workshops" element={<WorkshopsPage />} />
        <Route path="/compass/sunroom" element={<SunroomPage />} />
        <Route path="/compass/progress" element={<ProgressPage />} />
        <Route path="/compass/about" element={<AboutPage />} />
        <Route path="/compass/crisis" element={<CrisisPage />} />
        <Route path="/compass/life-of-ivor" element={<LifeOfIvorPage />} />
        <Route path="/compass/record" element={<RecordPage />} />
      </Route>
      <Route path="/installation" element={<InstallationPage />} />
      <Route path="/novel" element={
        <div className="min-h-screen bg-compass-black text-white flex flex-col">
          <header className="bg-compass-black/95 border-b-2 border-gold/30">
            <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
              <span className="font-bold-shell text-gold text-lg tracking-tight">Ivor's Compass</span>
              <a href="https://compass.blkoutuk.com" className="text-sm text-text-muted hover:text-gold transition-colors">Get access &rarr;</a>
            </div>
          </header>
          <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
            <LifeOfIvorPage />
          </main>
          <footer className="border-t-2 border-gold/20 py-6 px-4">
            <div className="max-w-lg mx-auto text-center space-y-3">
              <p className="text-xs text-text-muted">A community-owned heritage project by <span className="text-blkout-red font-semibold">BLKOUT</span></p>
              <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted/60">
                <span>Croydon Council</span><span>&mdash;</span><span>National Lottery Heritage Fund</span>
              </div>
            </div>
          </footer>
        </div>
      } />
      <Route path="/interview/feedback" element={<InterviewFeedbackPage />} />
      <Route path="/interview/:tableSlug" element={<InterviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <CompassProvider>
      <AppRoutes />
    </CompassProvider>
  )
}
