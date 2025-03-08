import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-600 text-white py-4 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm">© {new Date().getFullYear()} Sowalnk. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
