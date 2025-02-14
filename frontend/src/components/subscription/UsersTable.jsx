import { UserRow } from "./UserRow";

export const UsersTable = ({ users, onUserAction, getDateDetails }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user, index) => (
            <UserRow
              key={user._id}
              user={user}
              index={index}
              onAction={onUserAction}
              getDateDetails={getDateDetails}
            />
          ))}
        </tbody>
      </table>
  
      {users?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users added yet</p>
        </div>
      )}
    </div>
  );
  