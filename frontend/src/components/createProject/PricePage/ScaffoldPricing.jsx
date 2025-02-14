import React, { useEffect, useState } from 'react';
import { AddScaffoldForm } from './Form/AddScaffoldForm';
import { PriceTable } from './PriceTable/PriceTable';
import { EditModal } from './EditModal/EditModal';
import { INITIAL_PRICE_STATE, UNIT_TYPES } from './constants/constants';
import Footer from '../../Footer';
import Header from '../../Header';
import { scaffoldSchema } from './ValidationSchema/ValidationSchema';
import { HardDriveUpload } from 'lucide-react';
import { createPriceFormService, getPriceFormByProjectIdService } from '../../../Services/priceFormService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export const ScaffoldPricing = () => {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [headers, setHeaders] = useState([...UNIT_TYPES]);
    const [scaffoldData, setScaffoldData] = useState({
        volume: [],
        rent: [],
    });

    const [formData, setFormData] = useState({
        scaffoldName: '',
        prices: { ...INITIAL_PRICE_STATE }
    });

    const [editingState, setEditingState] = useState({
        id: null,
        type: null
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchFormData()
    }, [])

    const fetchFormData = async () => {
        setFetchLoading(true)
        try {
            const fetchResponse = await getPriceFormByProjectIdService(projectId);
            if (fetchResponse.success) {
                
                setScaffoldData(fetchResponse?.data);
                const allPriceKeys = fetchResponse?.data?.rent?.reduce((keys, scaffold) => {
                    const priceKeys = Object.keys(scaffold.prices)
                        .filter(key => key.toLowerCase() !== 'rent');
                    priceKeys.forEach(key => keys.add(key));
                    return keys;
                }, new Set());

                const activeKeys = Array.from(allPriceKeys)
                setHeaders(activeKeys)
            }
        } catch (error) {
            console.error("Error while fetching form data:", error);

        } finally {
            setFetchLoading(false)
        }
    };

    const handleInputChange = (e, unitType) => {
        let newFormData;

        if (unitType) {
            newFormData = {
                ...formData,
                prices: {
                    ...formData.prices,
                    [unitType]: e.target.value
                }
            };

            // Clear price-specific error
            setErrors(prev => ({
                ...prev,
                prices: {
                    ...prev.prices,
                    [unitType]: undefined
                }
            }));
        } else {
            const { name, value } = e.target;
            newFormData = {
                ...formData,
                [name]: value
            };

            // Clear field-specific error
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        setFormData(newFormData);

        scaffoldSchema.validate(newFormData, { abortEarly: false })
            .then(() => {
                setErrors({});
            })
            .catch(() => {
            });
    };

    const validateForm = async (data) => {
        try {
            await scaffoldSchema.validate(data, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            if (err) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    if (error.path) {
                        if (error.path.startsWith('prices.')) {
                            if (!newErrors.prices) newErrors.prices = {};
                            const pricePath = error.path.split('.')[1];
                            newErrors.prices[pricePath] = error.message;
                        } else if (error.path === 'prices') {
                            newErrors.general = error.message;
                        } else {
                            newErrors[error.path] = error.message;
                        }
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm(formData);
        if (!isValid) return;

        const newEntry = {
            id: Date.now(),
            scaffoldName: formData.scaffoldName,
            prices: formData.prices
        };
        setScaffoldData(prev => ({
            volume: [...prev.volume, newEntry],
            rent: [...prev.rent, newEntry]
        }));

        setFormData({
            scaffoldName: '',
            prices: { ...INITIAL_PRICE_STATE }
        });

        setErrors({});
    };

    const handleEdit = (item, type) => {

        setEditingState({
            id: item.id,
            type: type
        });
        setFormData({
            scaffoldName: item.scaffoldName,
            prices: item.prices
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm(formData);
        if (!isValid) return;

        if (editingState.type && editingState.id) {
            setScaffoldData(prev => ({
                ...prev,
                [editingState.type]: prev[editingState.type].map(item =>
                    item.id === editingState.id
                        ? { ...item, ...formData }
                        : item
                )
            }));
        }

        setEditModalOpen(false);
        setEditingState({ id: null, type: null });
        setFormData({
            scaffoldName: '',
            prices: { ...INITIAL_PRICE_STATE }
        });
        setErrors({});
    };

    const handleDelete = (id, type) => {
        setScaffoldData(prev => {
            // Create a new state object
            const newState = {
                volume: [...prev.volume],  // Copy volume array
                rent: [...prev.rent]       // Copy rent array
            };

            // Only modify the array specified by 'type'
            newState[type] = newState[type].filter(item => item.id !== id);

            return newState;
        });
    };

    const handleScaffoldForm = async () => {
        setLoading(true);

        try {
            const sendResponseData = {
                ...scaffoldData,
                projectId
            };
            const responseData = await createPriceFormService(sendResponseData);
            if (responseData.success) {
                toast.success(responseData?.message);
            } else {
                toast.error(responseData?.message);
            }
        } catch (error) {
            console.error("Error while submitting scaffold form:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomUnit = (customUnit) => {
        if (!customUnit || headers.includes(customUnit)) {
            setErrors((prev) => ({
                ...prev,
                general: customUnit ? 'Unit already exists.' : 'Unit cannot be empty.'
            }));
            return;
        }

        setHeaders((prev) => [...prev, customUnit]); // Add new unit to headers
        setFormData((prev) => ({
            ...prev,
            prices: { ...prev.prices, [customUnit]: '' } // Add custom unit to prices
        }));
        setErrors({});
    };

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Scaffold Pricing Management</h1>

                    <AddScaffoldForm
                        formData={formData}
                        onSubmit={handleSubmit}
                        onInputChange={handleInputChange}
                        errors={errors}
                        handleScaffoldForm={handleScaffoldForm}
                        headers={headers}
                        onAddCustomUnit={handleAddCustomUnit}
                    />

                    <PriceTable
                        data={scaffoldData.volume}
                        title="Volume Price"
                        type="volume"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isVolume={true}
                    />

                    <PriceTable
                        data={scaffoldData.rent}
                        title="Rent Price"
                        type="rent"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isRent={true}
                    />

                    {editModalOpen && (
                        <EditModal
                            formData={formData}
                            editingState={editingState}
                            onClose={() => setEditModalOpen(false)}
                            onSubmit={handleEditSubmit}
                            onInputChange={handleInputChange}
                            headers={headers}
                        />
                    )}
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => handleScaffoldForm()}
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {
                                loading ?
                                    <div className="flex space-x-2">
                                        <p className="font-bold">Loading</p>
                                        <span className="loading loading-dots loading-sm"></span>
                                    </div>
                                    :
                                    <>
                                        <HardDriveUpload className="w-4 h-4 mr-2" />
                                        Update Price Form
                                    </>
                            }
                        </button>
                    </div>

                </div>
            </div>
            {
                fetchLoading && <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex space-x-2">
                        <p className="font-bold">Loading</p>
                        <span className="loading loading-dots loading-sm"></span>
                    </div>
                </div>
            }
            <Footer />
        </>
    );
};

export default ScaffoldPricing;