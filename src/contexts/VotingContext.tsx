import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Competition, Contestant, Vote, PaymentTransaction, CompetitionStats, UserVoteHistory } from '../types';

interface VotingState {
  competitions: Competition[];
  contestants: Contestant[];
  votes: Vote[];
  transactions: PaymentTransaction[];
  userVoteHistory: UserVoteHistory[];
  currentCompetition: Competition | null;
  loading: boolean;
}

type VotingAction = 
  | { type: 'SET_COMPETITIONS'; payload: Competition[] }
  | { type: 'ADD_COMPETITION'; payload: Competition }
  | { type: 'UPDATE_COMPETITION'; payload: Competition }
  | { type: 'DELETE_COMPETITION'; payload: string }
  | { type: 'SET_CURRENT_COMPETITION'; payload: Competition | null }
  | { type: 'SET_CONTESTANTS'; payload: Contestant[] }
  | { type: 'ADD_CONTESTANT'; payload: Contestant }
  | { type: 'UPDATE_CONTESTANT'; payload: Contestant }
  | { type: 'DELETE_CONTESTANT'; payload: string }
  | { type: 'ADD_VOTE'; payload: Vote }
  | { type: 'ADD_TRANSACTION'; payload: PaymentTransaction }
  | { type: 'UPDATE_USER_VOTE_HISTORY'; payload: UserVoteHistory }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: VotingState = {
  competitions: [
    {
      id: '1',
      title: 'Talent Show 2024',
      description: 'Annual talent competition featuring singers, dancers, comedians and more',
      coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'active',
      votingRules: {
        maxVotesPerUser: 5,
        requirePayment: true,
        votePrice: 20
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      totalVotes: 466,
      totalContestants: 4
    },
    {
      id: '2',
      title: 'Beauty Pageant 2024',
      description: 'Celebrating beauty, intelligence and talent in our annual pageant',
      coverImage: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-11-30'),
      status: 'active',
      votingRules: {
        maxVotesPerUser: 3,
        requirePayment: true,
        votePrice: 25
      },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      totalVotes: 234,
      totalContestants: 3
    },
    {
      id: '3',
      title: 'Innovation Challenge',
      description: 'Tech entrepreneurs competing for the best innovative solution',
      coverImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-10-31'),
      status: 'draft',
      votingRules: {
        maxVotesPerUser: 1,
        requirePayment: false,
        votePrice: 0
      },
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
      totalVotes: 0,
      totalContestants: 0
    }
  ],
  contestants: [
    // Talent Show contestants
    {
      id: '1',
      competitionId: '1',
      name: 'Sarah Johnson',
      description: 'Aspiring singer with a passion for classical music',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Music',
      votes: 125,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      competitionId: '1',
      name: 'Marcus Chen',
      description: 'Contemporary dancer and choreographer',
      photo: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Dance',
      votes: 98,
      isActive: true,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '3',
      competitionId: '1',
      name: 'Emma Rodriguez',
      description: 'Stand-up comedian and storyteller',
      photo: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Comedy',
      votes: 87,
      isActive: true,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    },
    {
      id: '4',
      competitionId: '1',
      name: 'David Kumar',
      description: 'Magic performer and illusionist',
      photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Magic',
      votes: 156,
      isActive: true,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    // Beauty Pageant contestants
    {
      id: '5',
      competitionId: '2',
      name: 'Isabella Martinez',
      description: 'Model and environmental advocate',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Beauty',
      votes: 89,
      isActive: true,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: '6',
      competitionId: '2',
      name: 'Sophia Williams',
      description: 'Medical student and community volunteer',
      photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Beauty',
      votes: 76,
      isActive: true,
      createdAt: new Date('2024-02-11'),
      updatedAt: new Date('2024-02-11')
    },
    {
      id: '7',
      competitionId: '2',
      name: 'Olivia Thompson',
      description: 'Artist and social entrepreneur',
      photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Beauty',
      votes: 69,
      isActive: true,
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-12')
    }
  ],
  votes: [],
  transactions: [],
  userVoteHistory: [],
  currentCompetition: null,
  loading: false
};

const votingReducer = (state: VotingState, action: VotingAction): VotingState => {
  switch (action.type) {
    case 'SET_COMPETITIONS':
      return { ...state, competitions: action.payload };
    case 'ADD_COMPETITION':
      return { ...state, competitions: [...state.competitions, action.payload] };
    case 'UPDATE_COMPETITION':
      return {
        ...state,
        competitions: state.competitions.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_COMPETITION':
      return {
        ...state,
        competitions: state.competitions.filter(c => c.id !== action.payload),
        contestants: state.contestants.filter(c => c.competitionId !== action.payload)
      };
    case 'SET_CURRENT_COMPETITION':
      return { ...state, currentCompetition: action.payload };
    case 'SET_CONTESTANTS':
      return { ...state, contestants: action.payload };
    case 'ADD_CONTESTANT':
      const updatedCompetitions = state.competitions.map(comp =>
        comp.id === action.payload.competitionId
          ? { ...comp, totalContestants: comp.totalContestants + 1 }
          : comp
      );
      return { 
        ...state, 
        contestants: [...state.contestants, action.payload],
        competitions: updatedCompetitions
      };
    case 'UPDATE_CONTESTANT':
      return {
        ...state,
        contestants: state.contestants.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CONTESTANT':
      const deletedContestant = state.contestants.find(c => c.id === action.payload);
      const updatedCompsAfterDelete = state.competitions.map(comp =>
        comp.id === deletedContestant?.competitionId
          ? { ...comp, totalContestants: Math.max(0, comp.totalContestants - 1) }
          : comp
      );
      return {
        ...state,
        contestants: state.contestants.filter(c => c.id !== action.payload),
        competitions: updatedCompsAfterDelete
      };
    case 'ADD_VOTE':
      const updatedContestants = state.contestants.map(c =>
        c.id === action.payload.contestantId 
          ? { ...c, votes: c.votes + 1 }
          : c
      );
      const updatedCompsAfterVote = state.competitions.map(comp =>
        comp.id === action.payload.competitionId
          ? { ...comp, totalVotes: comp.totalVotes + 1 }
          : comp
      );
      return {
        ...state,
        contestants: updatedContestants,
        competitions: updatedCompsAfterVote,
        votes: [...state.votes, action.payload]
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case 'UPDATE_USER_VOTE_HISTORY':
      const existingHistoryIndex = state.userVoteHistory.findIndex(
        h => h.competitionId === action.payload.competitionId
      );
      
      let updatedHistory;
      if (existingHistoryIndex >= 0) {
        updatedHistory = [...state.userVoteHistory];
        updatedHistory[existingHistoryIndex] = action.payload;
      } else {
        updatedHistory = [...state.userVoteHistory, action.payload];
      }
      
      return {
        ...state,
        userVoteHistory: updatedHistory
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const VotingContext = createContext<{
  state: VotingState;
  dispatch: React.Dispatch<VotingAction>;
  // Competition methods
  addCompetition: (competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt' | 'totalVotes' | 'totalContestants'>) => void;
  updateCompetition: (competition: Competition) => void;
  deleteCompetition: (id: string) => void;
  setCurrentCompetition: (competition: Competition | null) => void;
  // Contestant methods
  addContestant: (contestant: Omit<Contestant, 'id' | 'votes' | 'createdAt' | 'updatedAt'>) => void;
  updateContestant: (contestant: Contestant) => void;
  deleteContestant: (id: string) => void;
  getContestantsByCompetition: (competitionId: string) => Contestant[];
  // Voting methods
  submitVote: (competitionId: string, contestantId: string, paymentMethod?: string, amount?: number, phone?: string) => Promise<boolean>;
  getUserVoteHistory: (competitionId: string) => UserVoteHistory | null;
  canUserVote: (competitionId: string) => boolean;
  // Stats methods
  getCompetitionStats: (competitionId: string) => CompetitionStats;
} | null>(null);

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(votingReducer, initialState);

  const addCompetition = (competitionData: Omit<Competition, 'id' | 'createdAt' | 'updatedAt' | 'totalVotes' | 'totalContestants'>) => {
    const competition: Competition = {
      ...competitionData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalVotes: 0,
      totalContestants: 0
    };
    dispatch({ type: 'ADD_COMPETITION', payload: competition });
  };

  const updateCompetition = (competition: Competition) => {
    const updatedCompetition = { ...competition, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_COMPETITION', payload: updatedCompetition });
  };

  const deleteCompetition = (id: string) => {
    dispatch({ type: 'DELETE_COMPETITION', payload: id });
  };

  const setCurrentCompetition = (competition: Competition | null) => {
    dispatch({ type: 'SET_CURRENT_COMPETITION', payload: competition });
  };

  const addContestant = (contestantData: Omit<Contestant, 'id' | 'votes' | 'createdAt' | 'updatedAt'>) => {
    const contestant: Contestant = {
      ...contestantData,
      id: Date.now().toString(),
      votes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'ADD_CONTESTANT', payload: contestant });
  };

  const updateContestant = (contestant: Contestant) => {
    const updatedContestant = { ...contestant, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CONTESTANT', payload: updatedContestant });
  };

  const deleteContestant = (id: string) => {
    dispatch({ type: 'DELETE_CONTESTANT', payload: id });
  };

  const getContestantsByCompetition = (competitionId: string): Contestant[] => {
    return state.contestants.filter(c => c.competitionId === competitionId && c.isActive);
  };

  const getUserVoteHistory = (competitionId: string): UserVoteHistory | null => {
    return state.userVoteHistory.find(h => h.competitionId === competitionId) || null;
  };

  const canUserVote = (competitionId: string): boolean => {
    const competition = state.competitions.find(c => c.id === competitionId);
    if (!competition || competition.status !== 'active') return false;

    const history = getUserVoteHistory(competitionId);
    if (!history) return true;

    return history.votesUsed < history.maxVotes;
  };

  const submitVote = async (
    competitionId: string, 
    contestantId: string, 
    paymentMethod?: string, 
    amount?: number, 
    phone?: string
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const competition = state.competitions.find(c => c.id === competitionId);
      if (!competition) throw new Error('Competition not found');

      if (!canUserVote(competitionId)) {
        throw new Error('Vote limit reached for this competition');
      }

      // Simulate payment processing if required
      if (competition.votingRules.requirePayment && paymentMethod && amount) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const transaction: PaymentTransaction = {
          id: transactionId,
          userId: 'current_user', // In real app, get from auth context
          competitionId,
          contestantId,
          amount,
          paymentMethod,
          status: 'completed',
          timestamp: new Date(),
          phone,
          ipAddress: '192.168.1.1'
        };
        
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      }
      
      // Create vote record
      const vote: Vote = {
        id: `vote_${Date.now()}`,
        userId: 'current_user', // In real app, get from auth context
        competitionId,
        contestantId,
        transactionId: competition.votingRules.requirePayment ? `tx_${Date.now()}` : undefined,
        timestamp: new Date(),
        ipAddress: '192.168.1.1',
        verified: true
      };
      
      dispatch({ type: 'ADD_VOTE', payload: vote });

      // Update user vote history
      const currentHistory = getUserVoteHistory(competitionId);
      const updatedHistory: UserVoteHistory = {
        competitionId,
        votesUsed: (currentHistory?.votesUsed || 0) + 1,
        maxVotes: competition.votingRules.maxVotesPerUser,
        lastVoteDate: new Date()
      };
      
      dispatch({ type: 'UPDATE_USER_VOTE_HISTORY', payload: updatedHistory });
      
      return true;
    } catch (error) {
      console.error('Vote submission failed:', error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getCompetitionStats = (competitionId: string): CompetitionStats => {
    const competition = state.competitions.find(c => c.id === competitionId);
    const contestants = state.contestants.filter(c => c.competitionId === competitionId);
    const votes = state.votes.filter(v => v.competitionId === competitionId);
    const transactions = state.transactions.filter(t => t.competitionId === competitionId);
    
    return {
      totalVotes: votes.length,
      totalRevenue: transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      activeContestants: contestants.filter(c => c.isActive).length,
      totalTransactions: transactions.length,
      uniqueVoters: new Set(votes.map(v => v.userId)).size
    };
  };

  return (
    <VotingContext.Provider value={{
      state,
      dispatch,
      addCompetition,
      updateCompetition,
      deleteCompetition,
      setCurrentCompetition,
      addContestant,
      updateContestant,
      deleteContestant,
      getContestantsByCompetition,
      submitVote,
      getUserVoteHistory,
      canUserVote,
      getCompetitionStats
    }}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};