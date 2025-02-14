import * as yup from 'yup';
import { UNIT_TYPES } from '../constants/constants';

const priceValidation = yup.string()
    .test('is-number', 'Price must be a number', value =>
        value === '' || !isNaN(value)
    )
    .test('is-positive', 'Price must be positive', value =>
        value === '' || Number(value) >= 0
    );

const createPricesSchema = () => {
    const priceSchema = {};
    UNIT_TYPES.forEach(unit => {
        priceSchema[unit] = priceValidation;
    });
    return yup.object().shape(priceSchema);
};

export const scaffoldSchema = yup.object().shape({
    scaffoldName: yup.string()
        .required('Scaffold name is required')
        .min(3, 'Scaffold name must be at least 3 characters')
        .max(50, 'Scaffold name must be less than 50 characters'),
    prices: createPricesSchema()
        .test('at-least-one-price', 'At least one price must be provided', values =>
            Object.values(values).some(value => value !== '')
        )
});
