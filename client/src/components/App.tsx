import { useMemo } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import Layout from '@/layout';
import IndexPage from '@/pages/IndexPage';
import HomePage from '@/pages/HomePage';
import FriendPage from '@/pages/FriendPage';
import EarnPage from '@/pages/EarnPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import WalletPage from '@/pages/WalletPage';
import CheckInPage from '@/pages/CheckInPage';
import GamePage from '@/pages/GamePage';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/earn" element={<EarnPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/checkin" element={<CheckInPage />} />
          </Route>
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
      <ToastContainer position="top-center" transition={Zoom} theme="light" draggable={true} />
    </AppRoot>
  );
}
