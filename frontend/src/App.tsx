import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Compare from './pages/Compare';
import Geo from './pages/Geo';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/geo" element={<Geo />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
