import React from 'react';
import { Contestant, Competition } from '../../types';
import { Trophy, Heart, Share2, Lock } from 'lucide-react';

interface ContestantCardProps {
  contestant: Contestant;
  competition: Competition;
  onVote: () => void;
  totalVotes: number;
  canVote: boolean;
}

const ContestantCard: React.FC<ContestantCardProps> = ({ 
  contestant, 
  competition,
  onVote, 
  totalVotes,
  canVote
}) => {
  const votePercentage = totalVotes > 0 ? (contestant.votes / totalVotes) * 100 : 0;
  const isVotingEnabled = competition.status === 'active' && canVote;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?competition=${competition.id}&contestant=${contestant.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Vote for ${contestant.name}`,
        text: `Support ${contestant.name} in ${competition.title}!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const getVoteButtonText = () => {
    if (competition.status !== 'active') {
      return 'Voting Closed';
    }
    if (!canVote) {
      return 'Vote Limit Reached';
    }
    if (competition.votingRules.requirePayment) {
      return `Vote Now - $${competition.votingRules.votePrice}`;
    }
    return 'Vote Now - Free';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={contestant.photo}
          alt={contestant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {contestant.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{contestant.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{contestant.description}</p>
        
        {/* Vote Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Votes</span>
            <span className="text-sm font-bold text-gray-900">
              {contestant.votes.toLocaleString()} ({votePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(votePercentage, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Vote Button */}
        <button
          onClick={onVote}
          disabled={!isVotingEnabled}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group ${
            isVotingEnabled
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isVotingEnabled ? (
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
          {getVoteButtonText()}
        </button>
        
        {/* Achievement Badge */}
        {contestant.votes > 50 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-yellow-600">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Top Performer</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestantCard;