
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';

// Import your pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import CallsPage from './pages/CallsPage';
import CallSummaryPage from './pages/CallSummaryPage';
import AddClientPage from './pages/AddClientPage';
import EditClientPage from './pages/EditClientPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import DailyActionsPage from './pages/DailyActionsPage';
import RecordPage from './pages/RecordPage';
import SearchPage from './pages/SearchPage';
import PricingPage from './pages/PricingPage';
import Index from './pages/Index';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/add" element={<AddClientPage />} />
              <Route path="/clients/:id/edit" element={<EditClientPage />} />
              <Route path="/clients/:id" element={<ClientDetailsPage />} />
              <Route path="/calls" element={<CallsPage />} />
              <Route path="/calls/:id" element={<CallSummaryPage />} />
              <Route path="/daily-actions" element={<DailyActionsPage />} />
              <Route path="/record" element={<RecordPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
