import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TopSection from '../components/forms/TopSection'
import ObservationForms from '../components/ObservationForm/ObservationForms'
import { t } from '../utils/translate'
import { useSelector } from 'react-redux'


const ObservationForm = () => {
    const currentLanguage = useSelector(
        (state) => state?.global?.current_language
    );
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <>
            <Header />
            <div>
                <TopSection
                    keys={"unique"}
                    title={t("observationFrom")}
                    breadcrumData={[t("ourServices"), t("our-service-2"), t("observation")]}
                />
                <ObservationForms />
            </div>
            <Footer />
        </>
    )
}

export default ObservationForm