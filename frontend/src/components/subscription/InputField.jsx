export const InputField = ({
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    placeholder = '',
    error = '',
    className = ''
}) => (
    <div className={`space-y-1 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-md shadow-sm 
          ${error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }
          sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-0
          py-2 px-3 border transition-colors
        `}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
    </div>
);