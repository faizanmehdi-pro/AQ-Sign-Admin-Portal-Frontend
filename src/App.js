import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDrawer from './components/Drawer/MainDrawer';
import './App.css';
import Profile from './Pages/Profile/Profile';
import Customers from './Pages/Customers/Customers';
import Approval from './Pages/Approval/Approval';
import Login from './Pages/Login/Login';
import { AuthProvider, useAuth } from './components/Auth/AuthContext'
import Groups from './Pages/Groups/Groups';
import Logs from './Pages/Logs/Logs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageForms from './Pages/ManageForms/ManageForms';
import ImportData from './Pages/ImportData/ImportData';
import DocumentsList from './Pages/DocumentsList/DocumentsList';

const queryClient = new QueryClient();
// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router>
      <ToastContainer position="top-right" autoClose={3000} />
        {/* Public Route */}
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected Routes wrapped in MainDrawer */}
          <Route element={<MainDrawer />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval-form"
              element={
                <ProtectedRoute>
                  <Approval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval-form"
              element={
                <ProtectedRoute>
                  <Approval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog-list"
              element={
                <ProtectedRoute>
                  <DocumentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute>
                  <Logs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-forms"
              element={
                <ProtectedRoute>
                  <ManageForms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/import-data"
              element={
                <ProtectedRoute>
                  <ImportData />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
