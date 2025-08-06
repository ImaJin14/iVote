import React from 'react';
import { Competition } from '../../types';
import { Calendar, Users, Trophy, Clock, CheckCircle, Eye } from 'lucide-react';

interface CompetitionCardProps {
  competition: Competition;
  onClick: () => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onClick }) => {
  const getStatusIcon = () => {
    switch (competition.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'ended':
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (competition.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (competition.status) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Coming Soon';
      case 'ended':
        return 'Ended';
    }
  };

  const isVotingEnabled = competition.status === 'active';

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={competition.coverImage}
          alt={competition.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            {getStatusText()}
          </div>
        </div>
        {competition.votingRules.requirePayment && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              ${competition.votingRules.votePrice} per vote
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{competition.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{competition.description}</p>
        
        {/* Competition Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">{competition.totalContestants}</div>
            <div className="text-xs text-gray-500">Contestants</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">{competition.totalVotes.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Votes</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-gray-900">{competition.votingRules.maxVotesPerUser}</div>
            <div className="text-xs text-gray-500">Max Votes</div>
          </div>
        </div>
        
        {/* Action Button */}
        <button
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
            isVotingEnabled
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isVotingEnabled}
        >
          {isVotingEnabled ? 'View & Vote' : 'View Competition'}
        </button>
        
        {/* Competition Dates */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          {competition.startDate.toLocaleDateString()} - {competition.endDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;