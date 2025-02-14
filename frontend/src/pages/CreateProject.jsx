import React, { useEffect } from 'react'
import Header from '../components/Header'
import TopSection from '../components/forms/TopSection'
import Footer from '../components/Footer'
import Form from '../components/createProject/Form'
import { useSelector } from 'react-redux'
import { t } from '../utils/translate'

const CreateProject = () => {
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
          title={t("hero-button_02")}
          breadcrumData={[t("createYourProjectHere")]}
        />
        <Form />
      </div>
      <Footer />
    </>
  )
}

export default CreateProject