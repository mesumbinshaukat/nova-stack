import { useState } from 'react';
import { UserTable } from '../src/components/UserTable';
import { UserDetailModal } from '../src/components/UserDetailModal';
import { SignupChart } from '../src/components/SignupChart';
import Layout from '../src/components/Layout';

// Mock data for demonstration
const mockUsers = [
  { id: 1, email: 'admin@example.com', isAdmin: true, createdAt: '2024-01-01' },
  { id: 2, email: 'user1@example.com', isAdmin: false, createdAt: '2024-01-02' },
  { id: 3, email: 'user2@example.com', isAdmin: false, createdAt: '2024-01-03' },
  { id: 4, email: 'user3@example.com', isAdmin: false, createdAt: '2024-01-04' },
  { id: 5, email: 'user4@example.com', isAdmin: false, createdAt: '2024-01-05' },
];

const mockSignupData = [
  { date: 'Jan', users: 40 },
  { date: 'Feb', users: 55 },
  { date: 'Mar', users: 75 },
  { date: 'Apr', users: 90 },
  { date: 'May', users: 120 },
  { date: 'Jun', users: 150 },
];

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-display font-bold text-primary mb-4">
                User Statistics
              </h2>
              <SignupChart data={mockSignupData} />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-display font-bold text-primary mb-4">
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="stat bg-neutral/5 rounded-lg">
                  <div className="stat-title">Total Users</div>
                  <div className="stat-value text-primary">{mockUsers.length}</div>
                </div>
                <div className="stat bg-neutral/5 rounded-lg">
                  <div className="stat-title">Admin Users</div>
                  <div className="stat-value text-primary">
                    {mockUsers.filter(u => u.isAdmin).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-display font-bold text-primary mb-4">
              User Management
            </h2>
            <UserTable
              users={mockUsers}
              onRowClick={setSelectedUser}
            />
          </div>
        </div>
      </div>

      <UserDetailModal
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </Layout>
  );
} 