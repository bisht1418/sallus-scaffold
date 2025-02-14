import { UsersTable } from "./UsersTable";

export const UserManagement = ({
    userSubscribedCount,
    subscriptionPlan,
    userSubscriberData,
    onAddUser,
    onUserAction,
    getDateDetails
  }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>
          <button
            onClick={onAddUser}
            disabled={userSubscribedCount === subscriptionPlan?.users}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${userSubscribedCount === subscriptionPlan?.users 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Add User
          </button>
        </div>
  
        <UsersTable
          users={userSubscriberData}
          onUserAction={onUserAction}
          getDateDetails={getDateDetails}
        />
      </div>
    </div>
  );