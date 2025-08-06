import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Users, Trophy, DollarSign, CreditCard, TrendingUp, Activity, Calendar, Eye } from 'lucide-react';

const Dashboard = () => {
  const { state } = useVoting();
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');

  // Calculate overall stats
  const totalVotes = state.competitions.reduce((sum, c) => sum + c.totalVotes, 0);
  const totalRevenue = state.transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const activeCompetitions = state.competitions.filter(c => c.status === 'active').length;
  const totalContestants = state.contestants.length;

  const stats = [
    {
      title: 'Total Votes',
      value: totalVotes.toLocaleString(),
      icon: Trophy,
      color: 'bg-green-500',
      change: '+12%',
      period: 'vs last month'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+8.2%',
      period: 'vs last month'
    },
    {
      title: 'Active Competitions',
      value: activeCompetitions.toString(),
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+2',
      period: 'this month'
    },
    {
      title: 'Total Contestants',
      value: totalContestants.toString(),
      icon: Users,
      color: 'bg-orange-500',
      change: '+15%',
      period: 'vs last month'
    }
  ];

  // Get competitions for filter
  const competitions = state.competitions;

  // Filter data based on selected competition
  const getFilteredData = () => {
    if (selectedCompetition === 'all') {
      return {
        competitions: state.competitions,
        contestants: state.contestants,
        votes: state.votes,
        transactions: state.transactions
      };
    }
    
    return {
      competitions: state.competitions.filter(c => c.id === selectedCompetition),
      contestants: state.contestants.filter(c => c.competitionId === selectedCompetition),
      votes: state.votes.filter(v => v.competitionId === selectedCompetition),
      transactions: state.transactions.filter(t => t.competitionId === selectedCompetition)
    };
  };

  const filteredData = getFilteredData();

  // Top competitions by votes
  const topCompetitions = [...filteredData.competitions]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  // Top contestants across all competitions or selected competition
  const topContestants = [...filteredData.contestants]
    .filter(c => c.isActive)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  // Recent transactions
  const recentTransactions = [...filteredData.transactions]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your voting platform performance</p>
        </div>
        
        {/* Competition Filter */}
        <div className="flex items-center gap-4">
          <label htmlFor="competition-filter" className="text-sm font-medium text-gray-700">
            Filter by Competition:
          </label>
          <select
            id="competition-filter"
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Competitions</option>
            {competitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.period}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Competitions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top Competitions</h2>
          </div>
          <div className="space-y-4">
            {topCompetitions.map((competition, index) => (
              <div key={competition.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <img
                  src={competition.coverImage}
                  alt={competition.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {competition.title}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{competition.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {competition.totalVotes.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">votes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contestants */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top Contestants</h2>
          </div>
          <div className="space-y-4">
            {topContestants.map((contestant, index) => {
              const competition = state.competitions.find(c => c.id === contestant.competitionId);
              return (
                <div key={contestant.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={contestant.photo}
                    alt={contestant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contestant.name}
                    </p>
                    <p className="text-sm text-gray-500">{competition?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {contestant.votes.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">votes</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">Transaction</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Competition</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Contestant</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => {
                const contestant = state.contestants.find(c => c.id === transaction.contestantId);
                const competition = state.competitions.find(c => c.id === transaction.competitionId);
                return (
                  <tr key={transaction.id}>
                    <td className="py-3">
                      <span className="font-mono text-sm text-gray-600">
                        {transaction.id.slice(-8)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-gray-900">
                        {competition?.title || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-gray-900">
                        {contestant?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm font-semibold text-gray-900">
                        ${transaction.amount}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-gray-500">
                        {transaction.timestamp.toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {recentTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;