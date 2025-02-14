export const UserRow = ({ user, index, onAction, getDateDetails }) => (
    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div>
                    <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                    <div className="text-sm text-gray-500">{user.userEmail}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{user.company}</div>
            <div className="text-sm text-gray-500">{user.phoneNumber}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${user.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`}
            >
                {user.isActive ? 'Active' : 'Inactive'}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getDateDetails(user.startTime)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-3">
                <button
                    onClick={() => onAction(
                        user.isActive ? 'cancel_subscription' : 'continue_subscription',
                        user._id,
                        index
                    )}
                    className={`text-sm font-medium ${user.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        } transition-colors`}
                >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                    onClick={() => onAction('delete_subscription', user._id, index)}
                    className="text-sm font-medium text-red-600 hover:text-red-900 transition-colors"
                >
                    Remove
                </button>
            </div>
        </td>
    </tr>
);
