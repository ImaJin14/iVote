import React from 'react';
import { Vote, Shield, Award } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">iVote</h1>
              <p className="text-sm text-gray-600">Secure Voting Platform</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Fair & Transparent</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;