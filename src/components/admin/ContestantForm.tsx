import React, { useState, useEffect } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { Contestant } from '../../types';
import { X, Upload, User, Trophy } from 'lucide-react';

interface ContestantFormProps {
  contestant?: Contestant | null;
  onClose: () => void;
}

const ContestantForm: React.FC<ContestantFormProps> = ({ contestant, onClose }) => {
  const { state, addContestant, updateContestant } = useVoting();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: '',
    category: '',
    competitionId: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contestant) {
      setFormData({
        name: contestant.name,
        description: contestant.description,
        photo: contestant.photo,
        category: contestant.category,
        competitionId: contestant.competitionId,
        isActive: contestant.isActive
      });
    } else if (state.competitions.length > 0) {
      // Set default competition to the first active one
      const activeCompetition = state.competitions.find(c => c.status === 'active');
      setFormData(prev => ({
        ...prev,
        competitionId: activeCompetition?.id || state.competitions[0].id
      }));
    }
  }, [contestant, state.competitions]);

  const categories = [
    'Music',
    'Dance',
    'Comedy',
    'Magic',
    'Art',
    'Sports',
    'Technology',
    'Fashion',
    'Beauty',
    'Innovation',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.photo.trim()) {
      newErrors.photo = 'Photo URL is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.competitionId) {
      newErrors.competitionId = 'Competition is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (contestant) {
      updateContestant({
        ...contestant,
        ...formData
      });
    } else {
      addContestant(formData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Sample photos for quick selection
  const samplePhotos = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const getCompetitionName = (competitionId: string) => {
    const competition = state.competitions.find(c => c.id === competitionId);
    return competition?.title || 'Unknown Competition';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {contestant ? 'Edit Contestant' : 'Add New Contestant'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Competition Selection */}
          <div>
            <label htmlFor="competitionId" className="block text-sm font-medium text-gray-700 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Competition *
            </label>
            <select
              id="competitionId"
              value={formData.competitionId}
              onChange={(e) => handleInputChange('competitionId', e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.competitionId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select a competition</option>
              {state.competitions.map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.title} ({competition.status})
                </option>
              ))}
            </select>
            {errors.competitionId && (
              <p className="mt-1 text-sm text-red-600">{errors.competitionId}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Contestant Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter contestant name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe the contestant's background, skills, or story"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Photo */}
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Photo URL *
            </label>
            <input
              type="url"
              id="photo"
              value={formData.photo}
              onChange={(e) => handleInputChange('photo', e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.photo ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://example.com/photo.jpg"
            />
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
            )}

            {/* Sample Photos */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Or choose from sample photos:</p>
              <div className="grid grid-cols-4 gap-2">
                {samplePhotos.map((photo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange('photo', photo)}
                    className={`relative w-full h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      formData.photo === photo ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Preview */}
            {formData.photo && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => handleInputChange('photo', '')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (contestant will be visible for voting)
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {contestant ? 'Update Contestant' : 'Add Contestant'}
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

export default ContestantForm;