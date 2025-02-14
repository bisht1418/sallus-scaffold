import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TopSection from '../components/forms/TopSection'
import RiskAssessment from '../components/RiskAssessmentForm/SafeJobAnalysis'
import SafeJobAnalysis from '../components/RiskAssessmentForm/SafeJobAnalysis'
import { useSelector } from 'react-redux'
import { t } from '../utils/translate'

const SafeJobAnalysisForm = () => {
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
                    title={t("workTaskTitle")}
                    breadcrumData={[t("our-service-title"), t("our-service-2"), t("workTaskTitle")]}
                />
                <SafeJobAnalysis />
            </div>
            <Footer />
        </>
    )
}

export default SafeJobAnalysisForm