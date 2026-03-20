import { Routes, Route, Navigate } from 'react-router-dom'
import { CompassProvider, useCompass } from './hooks/useCompass'
import Layout from './components/Layout'
import UnlockPage from './pages/UnlockPage'
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
        element={isUnlocked ? <Navigate to="/compass" replace /> : <UnlockPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/compass" element={<HomePage />} />
        <Route path="/compass/meditation/:id" element={<MeditationPage />} />
        <Route path="/compass/cards" element={<CardsPage />} />
        <Route path="/compass/poem" element={<PoemPage />} />
        <Route path="/compass/film" element={<FilmPage />} />
        <Route path="/compass/journal" element={<JournalPage />} />
        <Route path="/compass/mood" element={<MoodTrackerPage />} />
        <Route path="/compass/workshops" element={<WorkshopsPage />} />
        <Route path="/compass/about" element={<AboutPage />} />
        <Route path="/compass/crisis" element={<CrisisPage />} />
      </Route>
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
