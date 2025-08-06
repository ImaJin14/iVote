import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Competition } from '../../types';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Calendar, Users, Trophy } from 'lucide-react';
import CompetitionForm from './CompetitionForm';
import ConfirmDialog from '../ui/ConfirmDialog';

const CompetitionManagement = () => {
  const { state, updateCompetition, deleteCompetition } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'ended'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [deletingCompetition, setDeletingCompetition] = useState<Competition | null>(null);

  const filteredCompetitions = state.competitions.filter(competition => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || competition.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setShowForm(true);
  };

  const handleDelete = (competition: Competition) => {
    setDeletingCompetition(competition);
  };

  const confirmDelete = () => {
    if (deletingCompetition) {
      deleteCompetition(deletingCompetition.id);
      setDeletingCompetition(null);
    }
  };

  const toggleStatus = (competition: Competition) => {
    let newStatus: Competition['status'];
    
    switch (competition.status) {
      case 'draft':
        newStatus = 'active';
        break;
      case 'active':
        newStatus = 'ended';
        break;
      case 'ended':
        newStatus = 'draft';
        break;
      default:
        newStatus = 'draft';
    }

    updateCompetition({
      ...competition,
      status: newStatus
    });
  };

  const getStatusIcon = (status: Competition['status']) => {
    switch (status) {
      case 'active':
        return <Eye className="w-4 h-4" />;
      case 'draft':
        return <EyeOff className="w-4 h-4" />;
      case 'ended':
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Competition['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusText = (status: Competition['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'ended':
        return 'Ended';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competition Management</h1>
          <p className="text-gray-600">Create and manage competitions</p>
        </div>
        <button
          onClick={() => {
            setEditingCompetition(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Competition
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompetitions.map((competition) => (
          <div key={competition.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={competition.coverImage}
                alt={competition.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleStatus(competition)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusColor(competition.status)}`}
                >
                  {getStatusIcon(competition.status)}
                  {getStatusText(competition.status)}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{competition.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{competition.description}</p>
              
              {/* Competition Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{competition.totalContestants}</div>
                  <div className="text-xs text-gray-500">Contestants</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{competition.totalVotes.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {competition.votingRules.requirePayment ? `$${competition.votingRules.votePrice}` : 'Free'}
                  </div>
                  <div className="text-xs text-gray-500">Per Vote</div>
                </div>
              </div>

              {/* Competition Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>
                  {competition.startDate.toLocaleDateString()} - {competition.endDate.toLocaleDateString()}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(competition)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(competition)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Trophy className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No competitions found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'No competitions match your search criteria.'
              : 'Create your first competition to get started.'
            }
          </p>
        </div>
      )}

      {/* Competition Form Modal */}
      {showForm && (
        <CompetitionForm
          competition={editingCompetition}
          onClose={() => {
            setShowForm(false);
            setEditingCompetition(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingCompetition && (
        <ConfirmDialog
          title="Delete Competition"
          message={`Are you sure you want to delete "${deletingCompetition.title}"? This will also delete all associated contestants and votes. This action cannot be undone.`}
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingCompetition(null)}
        />
      )}
    </div>
  );
};

export default CompetitionManagement;