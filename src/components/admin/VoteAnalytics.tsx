import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';

const VoteAnalytics = () => {
  const { state } = useVoting();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  const contestants = state.contestants.filter(c => c.isActive);
  const totalVotes = contestants.reduce((sum, c) => sum + c.votes, 0);

  // Calculate vote percentage for each contestant
  const contestantStats = contestants.map(contestant => ({
    ...contestant,
    percentage: totalVotes > 0 ? (contestant.votes / totalVotes) * 100 : 0,
    revenue: contestant.votes * 20
  })).sort((a, b) => b.votes - a.votes);

  // Mock hourly data for the chart
  const generateHourlyData = () => {
    const hours = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      hours.push({
        hour: hour.getHours(),
        votes: Math.floor(Math.random() * 50) + 10,
        revenue: (Math.floor(Math.random() * 50) + 10) * 20
      });
    }
    return hours;
  };

  const hourlyData = generateHourlyData();
  const maxVotes = Math.max(...hourlyData.map(d => d.votes));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vote Analytics</h1>
          <p className="text-gray-600">Detailed insights into voting patterns and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-xl">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Votes</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalVotes.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+12% vs last period</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Avg Votes/Hour</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(hourlyData.reduce((sum, d) => sum + d.votes, 0) / hourlyData.length)}
          </p>
          <p className="text-sm text-green-600 mt-1">+8% vs last period</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Peak Hour</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {hourlyData.reduce((max, d) => d.votes > max.votes ? d : max).hour}:00
          </p>
          <p className="text-sm text-gray-600 mt-1">Most active voting time</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-xl">
              <Filter className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Conversion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">94.2%</p>
          <p className="text-sm text-green-600 mt-1">Payment success rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Voting Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hourly Voting Activity</h2>
          <div className="space-y-3">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-600 font-medium">
                  {data.hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{data.votes} votes</span>
                    <span className="text-sm text-gray-500">${data.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.votes / maxVotes) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contestant Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contestant Performance</h2>
          <div className="space-y-4">
            {contestantStats.map((contestant, index) => (
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
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contestant.name}
                    </p>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {contestant.votes.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{contestant.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${contestant.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{contestant.category}</span>
                    <span className="text-xs font-medium text-gray-700">
                      ${contestant.revenue.toLocaleString()} revenue
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteAnalytics;