import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Contestant } from '../../types';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import ContestantForm from './ContestantForm';
import ConfirmDialog from '../ui/ConfirmDialog';

const ContestantManagement = () => {
  const { state, updateContestant, deleteContestant } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(null);
  const [deletingContestant, setDeletingContestant] = useState<Contestant | null>(null);

  const filteredContestants = state.contestants.filter(contestant => {
    const matchesSearch = contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contestant.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompetition = competitionFilter === 'all' || contestant.competitionId === competitionFilter;
    return matchesSearch && matchesCompetition;
  });

  const handleEdit = (contestant: Contestant) => {
    setEditingContestant(contestant);
    setShowForm(true);
  };

  const handleDelete = (contestant: Contestant) => {
    setDeletingContestant(contestant);
  };

  const confirmDelete = () => {
    if (deletingContestant) {
      deleteContestant(deletingContestant.id);
      setDeletingContestant(null);
    }
  };

  const toggleStatus = (contestant: Contestant) => {
    updateContestant({
      ...contestant,
      isActive: !contestant.isActive
    });
  };

  const getCompetitionName = (competitionId: string) => {
    const competition = state.competitions.find(c => c.id === competitionId);
    return competition?.title || 'Unknown Competition';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contestant Management</h1>
          <p className="text-gray-600">Manage contestants across all competitions</p>
        </div>
        <button
          onClick={() => {
            setEditingContestant(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Contestant
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contestants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={competitionFilter}
              onChange={(e) => setCompetitionFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Competitions</option>
              {state.competitions.map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contestants Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contestant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Competition</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Votes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContestants.map((contestant) => (
                <tr key={contestant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={contestant.photo}
                        alt={contestant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{contestant.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{contestant.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {getCompetitionName(contestant.competitionId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {contestant.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {contestant.votes.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(contestant)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        contestant.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {contestant.isActive ? (
                        <>
                          <Eye className="w-4 h-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contestant.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(contestant)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contestant)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContestants.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchTerm || competitionFilter !== 'all' 
              ? 'No contestants found matching your criteria.' 
              : 'No contestants found. Add some contestants to get started.'
            }
          </div>
        )}
      </div>

      {/* Contestant Form Modal */}
      {showForm && (
        <ContestantForm
          contestant={editingContestant}
          onClose={() => {
            setShowForm(false);
            setEditingContestant(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingContestant && (
        <ConfirmDialog
          title="Delete Contestant"
          message={`Are you sure you want to delete "${deletingContestant.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingContestant(null)}
        />
      )}
    </div>
  );
};

export default ContestantManagement;