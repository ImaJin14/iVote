import React, { useState } from 'react';
import { useVoting } from '../../contexts/VotingContext';
import { PaymentTransaction } from '../../types';
import { Search, Filter, Download, CheckCircle, Clock, XCircle } from 'lucide-react';

const TransactionLogs = () => {
  const { state } = useVoting();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'mtn' | 'orange' | 'card'>('all');

  const filteredTransactions = state.transactions.filter(transaction => {
    const contestant = state.contestants.find(c => c.id === transaction.contestantId);
    const matchesSearch = contestant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || transaction.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const stats = {
    total: state.transactions.length,
    completed: state.transactions.filter(t => t.status === 'completed').length,
    pending: state.transactions.filter(t => t.status === 'pending').length,
    failed: state.transactions.filter(t => t.status === 'failed').length,
    totalRevenue: state.transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Contestant', 'Amount', 'Payment Method', 'Status', 'Phone', 'Timestamp', 'IP Address'].join(','),
      ...filteredTransactions.map(transaction => {
        const contestant = state.contestants.find(c => c.id === transaction.contestantId);
        return [
          transaction.id,
          contestant?.name || 'Unknown',
          transaction.amount,
          transaction.paymentMethod.toUpperCase(),
          transaction.status,
          transaction.phone || '',
          transaction.timestamp.toISOString(),
          transaction.ipAddress
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Logs</h1>
          <p className="text-gray-600">Monitor all payment transactions and their status</p>
        </div>
        <button
          onClick={exportTransactions}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Transactions</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Failed</h3>
          <p className="text-2xl font-bold text-red-600">{stats.failed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Payment Methods</option>
            <option value="mtn">MTN Mobile Money</option>
            <option value="orange">Orange Money</option>
            <option value="card">Card Payment</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contestant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const contestant = state.contestants.find(c => c.id === transaction.contestantId);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-sm text-gray-900">{transaction.id}</p>
                        <p className="text-xs text-gray-500">{transaction.ipAddress}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {contestant && (
                          <img
                            src={contestant.photo}
                            alt={contestant.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {contestant?.name || 'Unknown Contestant'}
                          </p>
                          <p className="text-sm text-gray-500">{contestant?.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        ${transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {transaction.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="capitalize">{transaction.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {transaction.phone || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {transaction.timestamp.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLogs;