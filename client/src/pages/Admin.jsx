import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUsers, FiFileText, FiAlertTriangle, FiPlus, FiTrash2, FiShield } from 'react-icons/fi';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Registered Users', value: '1,240', icon: '👥' },
    { label: 'Total Stories Published', value: '3,890', icon: '💬' },
    { label: 'Active Tree Diaries', value: '840', icon: '📖' },
    { label: 'Flagged Content Items', value: '2', icon: '⚠️' },
  ];

  const mockUsers = [
    { id: 'u1', name: 'Elena Rostova', email: 'elena@example.com', role: 'admin', trees: 18 },
    { id: 'u2', name: 'Marcus Chen', email: 'marcus@example.com', role: 'user', trees: 12 },
    { id: 'u3', name: 'Aaliyah Patel', email: 'aaliyah@example.com', role: 'user', trees: 9 },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient flex items-center gap-2">
            <FiShield className="text-amber-400" /> Admin Control Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">Platform moderation, analytics, and community challenge creation.</p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card glass p-6 border border-forest/20">
            <span className="text-3xl block mb-2">{s.icon}</span>
            <div className="text-2xl font-bold font-display text-white">{s.value}</div>
            <span className="text-xs text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'overview' ? 'border-forest-light text-light-green' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'moderation' ? 'border-forest-light text-light-green' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Moderation Queue (2)
        </button>
      </div>

      {/* User Management Table */}
      {activeTab === 'overview' ? (
        <div className="card glass border border-forest/30 overflow-hidden">
          <div className="p-4 bg-forest-dark/40 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider grid grid-cols-12">
            <span className="col-span-4">User</span>
            <span className="col-span-4">Email</span>
            <span className="col-span-2 text-center">Role</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          <div className="divide-y divide-white/5">
            {mockUsers.map((u) => (
              <div key={u.id} className="p-4 hover:bg-white/5 transition-colors grid grid-cols-12 items-center text-sm">
                <span className="col-span-4 font-semibold text-white">{u.name}</span>
                <span className="col-span-4 text-gray-300 text-xs">{u.email}</span>
                <span className="col-span-2 text-center">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                    u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'glass text-gray-300'
                  }`}>
                    {u.role}
                  </span>
                </span>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => toast.success(`Updated role for ${u.name}`)}
                    className="text-xs text-light-green hover:underline"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card glass p-5 border border-forest/20 flex justify-between items-center">
            <div>
              <span className="text-xs text-red-400 font-semibold uppercase">Flagged Comment</span>
              <p className="text-sm text-gray-200 mt-1">"Unrelated promotional link posted in feed..."</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.success('Approved item')} className="btn-outline text-xs !py-1.5 !px-3">Keep</button>
              <button onClick={() => toast.success('Removed item')} className="btn-primary text-xs !py-1.5 !px-3 !bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
