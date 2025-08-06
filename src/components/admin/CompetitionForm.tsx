import React, { useState, useEffect } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Competition } from '../../types';
import { X, Calendar, DollarSign, Users } from 'lucide-react';

interface CompetitionFormProps {
  competition?: Competition | null;
  onClose: () => void;
}

const CompetitionForm: React.FC<CompetitionFormProps> = ({ competition, onClose }) => {
  const { addCompetition, updateCompetition } = useVoting();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    startDate: '',
    endDate: '',
    status: 'draft' as Competition['status'],
    maxVotesPerUser: 1,
    requirePayment: false,
    votePrice: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (competition) {
      setFormData({
        title: competition.title,
        description: competition.description,
        coverImage: competition.coverImage,
        startDate: competition.startDate.toISOString().split('T')[0],
        endDate: competition.endDate.toISOString().split('T')[0],
        status: competition.status,
        maxVotesPerUser: competition.votingRules.maxVotesPerUser,
        requirePayment: competition.votingRules.requirePayment,
        votePrice: competition.votingRules.votePrice
      });
    }
  }, [competition]);

  const sampleImages = [
    'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.coverImage.trim()) {
      newErrors.coverImage = 'Cover image is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.maxVotesPerUser < 1) {
      newErrors.maxVotesPerUser = 'Max votes per user must be at least 1';
    }

    if (formData.requirePayment && formData.votePrice <= 0) {
      newErrors.votePrice = 'Vote price must be greater than 0 when payment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const competitionData = {
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status,
      votingRules: {
        maxVotesPerUser: formData.maxVotesPerUser,
        requirePayment: formData.requirePayment,
        votePrice: formData.votePrice
      }
    };

    if (competition) {
      updateCompetition({
        ...competition,
        ...competitionData
      });
    } else {
      addCompetition(competitionData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {competition ? 'Edit Competition' : 'Create New Competition'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Competition Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter competition title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Describe the competition"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.coverImage ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.coverImage && (
                  <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
                )}

                {/* Sample Images */}
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Or choose from sample images:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleImages.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleInputChange('coverImage', image)}
                        className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          formData.coverImage === image ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {formData.coverImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => handleInputChange('coverImage', '')}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Voting Rules */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Rules</h3>
                
                {/* Max Votes Per User */}
                <div className="mb-4">
                  <label htmlFor="maxVotesPerUser" className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Max Votes Per User *
                  </label>
                  <input
                    type="number"
                    id="maxVotesPerUser"
                    min="1"
                    value={formData.maxVotesPerUser}
                    onChange={(e) => handleInputChange('maxVotesPerUser', parseInt(e.target.value) || 1)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxVotesPerUser ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.maxVotesPerUser && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxVotesPerUser}</p>
                  )}
                </div>

                {/* Require Payment */}
                <div className="mb-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.requirePayment}
                      onChange={(e) => handleInputChange('requirePayment', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Require payment for voting
                    </span>
                  </label>
                </div>

                {/* Vote Price */}
                {formData.requirePayment && (
                  <div>
                    <label htmlFor="votePrice" className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Vote Price (USD) *
                    </label>
                    <input
                      type="number"
                      id="votePrice"
                      min="0"
                      step="0.01"
                      value={formData.votePrice}
                      onChange={(e) => handleInputChange('votePrice', parseFloat(e.target.value) || 0)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.votePrice ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.votePrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.votePrice}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {competition ? 'Update Competition' : 'Create Competition'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetitionForm;