import React from 'react';
import { useLibraryStore } from './store/libraryStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/ToastContainer';
// Feature Screens & 3D Landing
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { SearchPage } from './pages/SearchPage';
import { IssueBookPage } from './pages/IssueBookPage';
import { ReturnBookPage } from './pages/ReturnBookPage';
import { ReservationPage } from './pages/ReservationPage';
import { InventoryPage } from './pages/InventoryPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
export const App = () => {
    const { activeTab, isAuthenticated } = useLibraryStore();
    const isPublicScreen = activeTab === 'landing' || activeTab === 'login';
    const renderActiveScreen = () => {
        // If not authenticated and trying to access internal portal screens, require login
        if (!isAuthenticated && !isPublicScreen) {
            return <LoginPage />;
        }
        switch (activeTab) {
            case 'landing':
                return <LandingPage />;
            case 'login':
                return <LoginPage />;
            case 'dashboard':
                return <DashboardPage />;
            case 'catalog':
                return <CatalogPage />;
            case 'search':
                return <SearchPage />;
            case 'issue':
                return <IssueBookPage />;
            case 'return':
                return <ReturnBookPage />;
            case 'reservation':
                return <ReservationPage />;
            case 'inventory':
                return <InventoryPage />;
            case 'recommendations':
                return <RecommendationsPage />;
            case 'analytics':
                return <AnalyticsPage />;
            default:
                return isAuthenticated ? <DashboardPage /> : <LandingPage />;
        }
    };
    return (<div className="min-h-screen bg-slate-950 bg-mesh-radial flex flex-col font-sans text-slate-100">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Main Navigation Header */}
      <Navbar />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isPublicScreen || !isAuthenticated ? (<div className="w-full animate-fade-in">
            {renderActiveScreen()}
          </div>) : (<div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
            {/* Navigation Sidebar */}
            <Sidebar />

            {/* Dynamic Content Viewport */}
            <section className="flex-1 min-w-0">
              {renderActiveScreen()}
            </section>
          </div>)}
      </main>

      {/* Modern Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            <span>Smart LMS Core Online • In-Memory Reactive Store Active</span>
          </div>

          <p className="text-center sm:text-right">
            Smart Library Management System • Compliant with PRD, TRD & DevOps Specification
          </p>
        </div>
      </footer>
    </div>);
};
export default App;
