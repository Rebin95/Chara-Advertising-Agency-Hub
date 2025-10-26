// src/App.jsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import MainContent from './MainContent'; // ئەمە کۆمپۆنێنتی سەرەکیتە

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;