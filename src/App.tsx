import React from 'react';
import './App.css';
import Layout from './Layout/Layout'
import Democracy from './Democracy/Democracy'

const App: React.FC = () => {
  return (
    <Layout>
      <Democracy />
    </Layout> 
  );
}

export default App;
