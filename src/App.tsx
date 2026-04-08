import { type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CompassProvider, useCompass } from './hooks/useCompass'
import Layout from './components/Layout'
import UnlockPage from './pages/UnlockPage'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import MeditationPage from './pages/MeditationPage'
import CardsPage from './pages/CardsPage'
import PoemPage from './pages/PoemPage'
import FilmPage from './pages/FilmPage'
import JournalPage from './pages/JournalPage'
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
        <Route path="/compass/poem" element={<PoemPage />} />
        <Route path="/compass/film" element={<FilmPage />} />
        <Route path="/compass/journal" element={<JournalPage />} />
        <Route path="/compass/mood" element={<MoodTrackerPage />} />
        <Route path="/compass/workshops" element={<WorkshopsPage />} />
        <Route path="/compass/sunroom" element={<SunroomPage />} />
        <Route path="/compass/progress" element={<ProgressPage />} />
        <Route path="/compass/about" element={<AboutPage />} />
        <Route path="/compass/crisis" element={<CrisisPage />} />
        <Route path="/compass/life-of-ivor" element={<LifeOfIvorPage />} />
        <Route path="/compass/record" element={<RecordPage />} />
      </Route>
      <Route path="/interview/:tableId" element={<InterviewPage />} />
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
