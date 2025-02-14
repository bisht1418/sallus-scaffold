export const FormField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  ...props
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
          ${error ? 'focus:border-red-500' : 'focus:border-blue-500'}
          transition-colors`}
      {...props}
    />
    {error && (
      <p className="text-sm text-red-600 mt-1">{error}</p>
    )}
  </div>
);