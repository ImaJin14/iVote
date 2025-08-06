export interface Competition {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'ended';
  votingRules: {
    maxVotesPerUser: number;
    requirePayment: boolean;
    votePrice: number;
  };
  createdAt: Date;
  updatedAt: Date;
  totalVotes: number;
  totalContestants: number;
}

export interface Contestant {
  id: string;
  competitionId: string;
  name: string;
  description: string;
  photo: string;
  category: string;
  votes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  userId: string;
  competitionId: string;
  contestantId: string;
  transactionId?: string;
  timestamp: Date;
  ipAddress: string;
  verified: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  competitionId: string;
  contestantId: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  phone?: string;
  ipAddress: string;
}

export interface UserVoteHistory {
  competitionId: string;
  votesUsed: number;
  maxVotes: number;
  lastVoteDate: Date;
}

export type PaymentMethod = 'mtn' | 'orange' | 'card';

export interface CompetitionStats {
  totalVotes: number;
  totalRevenue: number;
  activeContestants: number;
  totalTransactions: number;
  uniqueVoters: number;
}