import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import CompetitionCard from './CompetitionCard';
import CompetitionDetail from './CompetitionDetail';
import { Competition } from '../../types';

const CompetitionGrid = () => {
  const { state } = useVoting();
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'ended'>('all');

  const filteredCompetitions = state.competitions.filter(competition => {
    if (statusFilter === 'all') return true;
    return competition.status === statusFilter;
  });

  if (selectedCompetition) {
    return (
      <CompetitionDetail
        competition={selectedCompetition}
        onBack={() => setSelectedCompetition(null)}
      />
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-white rounded-2xl p-2 shadow-sm border">
          {[
            { key: 'all', label: 'All Competitions' },
            { key: 'active', label: 'Active' },
            { key: 'draft', label: 'Coming Soon' },
            { key: 'ended', label: 'Ended' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompetitions.map((competition) => (
          <CompetitionCard
            key={competition.id}
            competition={competition}
            onClick={() => setSelectedCompetition(competition)}
          />
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No competitions found</h3>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? 'No competitions are available at the moment.'
              : `No ${statusFilter} competitions found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CompetitionGrid;