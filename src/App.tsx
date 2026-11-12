import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { PlainLayout } from './layouts/PlainLayout';
import { PublicOnly, RequireAuth } from './routes/guards';
import ChatPage from './pages/ChatPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HelpPage from './pages/HelpPage';
import LegalPage from './pages/LegalPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ChatProvider>
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                  <Route element={<PublicOnly />}>
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/verify-email" element={<VerifyEmailPage />} />
                    </Route>
                  </Route>
                  <Route element={<RequireAuth />}>
                    <Route element={<AppLayout />}>
                      <Route index element={<ChatPage />} />
                      <Route path="c/:id" element={<ChatPage />} />
                      <Route path="help" element={<HelpPage />} />
                    </Route>
                  </Route>
                  <Route element={<PlainLayout />}>
                    <Route path="/terms" element={<LegalPage kind="terms" />} />
                    <Route path="/privacy" element={<LegalPage kind="privacy" />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
