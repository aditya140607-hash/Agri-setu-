/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import { LanguageProvider } from './contexts/LanguageContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';

// Page Imports
import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage.js';
import { CropDetectionPage } from './pages/CropDetectionPage.js';
import { SchemesPage } from './pages/SchemesPage.js';
import { SchemeCheckerPage } from './pages/SchemeCheckerPage.js';
import { WeatherPage } from './pages/WeatherPage.js';
import { MandiPage } from './pages/MandiPage.js';
import { CropGuidancePage } from './pages/CropGuidancePage.js';
import { InsurancePage } from './pages/InsurancePage.js';
import { ExpertsPage } from './pages/ExpertsPage.js';
import { ChatbotPage } from './pages/ChatbotPage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { HelpSupportPage } from './pages/HelpSupportPage.js';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage.js';

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  // Navigation routing state synced with URL hash
  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'dashboard':
        return isAuthenticated ? (
          <FarmerDashboardPage onNavigate={navigateTo} />
        ) : (
          <LoginPage onNavigate={navigateTo} />
        );
      case 'crop-detection':
        return <CropDetectionPage onNavigate={navigateTo} />;
      case 'schemes':
        return <SchemesPage onNavigate={navigateTo} />;
      case 'scheme-checker':
        return <SchemeCheckerPage onNavigate={navigateTo} />;
      case 'weather':
        return <WeatherPage onNavigate={navigateTo} />;
      case 'mandi':
        return <MandiPage onNavigate={navigateTo} />;
      case 'guidance':
        return <CropGuidancePage onNavigate={navigateTo} />;
      case 'insurance':
        return <InsurancePage onNavigate={navigateTo} />;
      case 'experts':
        return <ExpertsPage onNavigate={navigateTo} />;
      case 'chatbot':
        return <ChatbotPage onNavigate={navigateTo} />;
      case 'notifications':
        return <NotificationsPage onNavigate={navigateTo} />;
      case 'profile':
        return isAuthenticated ? (
          <ProfilePage onNavigate={navigateTo} />
        ) : (
          <LoginPage onNavigate={navigateTo} />
        );
      case 'admin':
        return <AdminDashboardPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;
      case 'help':
        return <HelpSupportPage onNavigate={navigateTo} />;
      case 'privacy-terms':
        return <PrivacyTermsPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentView={currentView} onNavigate={navigateTo} />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
