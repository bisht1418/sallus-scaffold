import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Header from '../../Header';
import Footer from '../../Footer';
import PriceTable from './PriceTable/PriceTable';
import { useParams } from 'react-router-dom';
import RentPeriodSelection from './RentPeriodSelection/RentPeriodSelection';
import { getPriceFormByProjectIdService } from '../../../Services/priceFormService';
import { toast } from 'react-toastify';
import { getApprovalListingPageByProjectId } from '../../../Services/approvalListingPageService';

export const RentalBasePage = () => {

    const { projectId } = useParams()
    const [loading, setLoading] = useState(false);
    const [approvalListingLoading, setApprovalLoading] = useState(false);
    const [rentData, setRentData] = useState([]);
    const [headers, setHeaders] = useState([]);

    const [approvalFormData, setApprovalFormData] = useState([]);

    useEffect(() => {
        handleScaffoldForm(projectId);
        getApprovalData(projectId)
    }, [projectId]);

    const handleScaffoldForm = async (projectId) => {
        setLoading(true);

        try {
            const responseData = await getPriceFormByProjectIdService(projectId);

            if (responseData.success) {
                setRentData(responseData?.data?.rent || []);
                if (responseData?.data?.rent?.length > 0) {
                    // Extract all unique keys from the `prices` object across all items
                    const allKeys = [
                        ...new Set(
                            responseData?.data?.rent.flatMap(item =>
                                Object.keys(item.prices || {})
                            )
                        )
                    ];
                    const priceKeys = allKeys.filter(key => key.toLowerCase() !== 'volume');

                    const dynamicHeaders = ['Scaffold Name', ...priceKeys.map(key => `Price (${key})`)];

                    // Update the headers state
                    setHeaders(dynamicHeaders);
                }

            } else {
                console.error(responseData?.message);
            }
        } catch (error) {
            console.error('Error while fetching scaffold form:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getApprovalData = async (projectId) => {
        try {
            setApprovalLoading(true);
            const response = await getApprovalListingPageByProjectId(projectId);
            const approvalData = response?.data?.data;
            const filterData = approvalData?.filter(
                (element, index) => !element?.isDeleted
            );
            setApprovalFormData(filterData || [])
        } catch (Error) {
            setApprovalLoading(false);
            return Error;
        } finally {
            setApprovalLoading(false);
        }
    };


    return (
        <div className="">
            <Header />
            <Container className="py-8 custom-container">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Rental Base Price Calculator
                </h1>
                {/* <PriceTable projectId={projectId} loading={loading} rentData={rentData} headers={headers} /> */}

                <RentPeriodSelection projectId={projectId} loading={approvalListingLoading} rentData={rentData} headers={headers} approvalFormData={approvalFormData} />

            </Container>
            <Footer />
        </div>
    );
};