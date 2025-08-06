import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Competition, Contestant } from '../../types';
import ContestantCard from '../voting/ContestantCard';
import VotingModal from '../voting/VotingModal';
import { ArrowLeft, Trophy, Users, Calendar, DollarSign, Share2, Info } from 'lucide-react';

interface CompetitionDetailProps {
  competition: Competition;
  onBack: () => void;
}

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competition, onBack }) => {
  const { getContestantsByCompetition, getUserVoteHistory, canUserVote } = useVoting();
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [showVotingModal, setShowVotingModal] = useState(false);

  const contestants = getContestantsByCompetition(competition.id);
  const userVoteHistory = getUserVoteHistory(competition.id);
  const canVote = canUserVote(competition.id);
  const totalVotes = contestants.reduce((sum, c) => sum + c.votes, 0);

  const handleVoteClick = (contestant: Contestant) => {
    if (competition.status !== 'active') {
      alert('Voting is not available for this competition');
      return;
    }
    
    if (!canVote) {
      alert(`You have reached the maximum number of votes (${competition.votingRules.maxVotesPerUser}) for this competition`);
      return;
    }

    setSelectedContestant(contestant);
    setShowVotingModal(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: competition.title,
        text: `Check out ${competition.title} and vote for your favorite contestant!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
        return 'Active - Voting Open';
      case 'draft':
        return 'Coming Soon';
      case 'ended':
        return 'Competition Ended';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Competitions
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={competition.coverImage}
              alt={competition.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
                <h1 className="text-4xl font-bold mb-2">{competition.title}</h1>
                <p className="text-xl opacity-90">{competition.description}</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          <div className="p-8">
            {/* Competition Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{contestants.length}</div>
                <div className="text-sm text-gray-500">Contestants</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalVotes.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{competition.votingRules.maxVotesPerUser}</div>
                <div className="text-sm text-gray-500">Max Votes/User</div>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {competition.votingRules.requirePayment ? `$${competition.votingRules.votePrice}` : 'Free'}
                </div>
                <div className="text-sm text-gray-500">Per Vote</div>
              </div>
            </div>

            {/* User Vote Status */}
            {userVoteHistory && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Your Voting Status</h3>
                </div>
                <p className="text-blue-800">
                  You have used <strong>{userVoteHistory.votesUsed}</strong> out of <strong>{userVoteHistory.maxVotes}</strong> votes.
                  {canVote ? (
                    <span className="text-green-600 font-medium"> You can still vote!</span>
                  ) : (
                    <span className="text-red-600 font-medium"> You have reached your vote limit.</span>
                  )}
                </p>
              </div>
            )}

            {/* Competition Dates */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Competition Period</h3>
                  <p className="text-gray-600">
                    {competition.startDate.toLocaleDateString()} - {competition.endDate.toLocaleDateString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contestants */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Meet the Contestants
        </h2>
        
        {contestants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {contestants.map((contestant) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                onVote={() => handleVoteClick(contestant)}
                totalVotes={totalVotes}
                competition={competition}
                canVote={canVote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contestants yet</h3>
            <p className="text-gray-600">
              Contestants will be added soon. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {showVotingModal && selectedContestant && (
        <VotingModal
          contestant={selectedContestant}
          competition={competition}
          onClose={() => {
            setShowVotingModal(false);
            setSelectedContestant(null);
          }}
        />
      )}
    </div>
  );
};

export default CompetitionDetail;