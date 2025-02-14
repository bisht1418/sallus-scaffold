import React, { useEffect } from 'react'
import Header from '../components/Header'
import TopSection from '../components/forms/TopSection'
import Footer from '../components/Footer'
import EditMainList from '../components/materialLIst/EditMainList'
import { useSelector } from 'react-redux'
import { t } from '../utils/translate'

const EditMaterialList = () => {
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
                    title={t("editMaterialList")}
                    breadcrumData={[t("home"), t("ourServices"), t("materialList")]}
                />
                <EditMainList />
            </div>
            <Footer />
        </>
    )
}

export default EditMaterialList