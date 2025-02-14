import React, { useEffect } from 'react'
import Header from '../components/Header'
import TopSection from '../components/forms/TopSection'
import Footer from '../components/Footer'
import MainListing from '../components/materialLIst/MainListing'
import { useSelector } from 'react-redux'
import { t } from '../utils/translate'

const MaterialList = () => {
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
          title={t("materialList")}
          breadcrumData={[t("home"), t("ourServices"), t("materialList")]}
        />
        <MainListing />
      </div>
      <Footer />
    </>
  )
}

export default MaterialList