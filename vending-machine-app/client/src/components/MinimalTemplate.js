import React from 'react';

const MinimalTemplate = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <header>
        <h2>Vending Machine</h2>
      </header>
      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default MinimalTemplate;
