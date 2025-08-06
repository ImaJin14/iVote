import React from 'react';
import { useVoting } from '../contexts/VotingContext';
import CompetitionGrid from './competitions/CompetitionGrid';
import Header from './common/Header';
import { Trophy, Users, Calendar, Award } from 'lucide-react';

const VotingInterface = () => {
  const { state } = useVoting();

  const activeCompetitions = state.competitions.filter(c => c.status === 'active');
  const totalVotes = state.competitions.reduce((sum, c) => sum + c.totalVotes, 0);
  const totalContestants = state.competitions.reduce((sum, c) => sum + c.totalContestants, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            iVote Competition Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover amazing competitions and vote for your favorite contestants. 
            Every vote counts and helps determine the winners!
          </p>
          
          {/* Stats Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{state.competitions.length}</div>
                <div className="text-sm text-gray-500">Total Competitions</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{activeCompetitions.length}</div>
                <div className="text-sm text-gray-500">Active Competitions</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalContestants}</div>
                <div className="text-sm text-gray-500">Total Contestants</div>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalVotes.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Votes Cast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <CompetitionGrid />
        </div>
      </section>
    </div>
  );
};

export default VotingInterface;