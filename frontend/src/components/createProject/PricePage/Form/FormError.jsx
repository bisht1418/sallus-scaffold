import React from 'react';

export const FormError = ({ error }) => (   
    error ? (
        <p className="text-sm text-red-600 mt-1">{error}</p>
    ) : null
);