
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dummy from '@/data/dummy';
import GlobalApi from './../../../service/GlobalApi';
import FormSection from './edit-resume/form-section';
import ResumePreview from './edit-resume/resume-preview';
import { ResumeInfoContext } from '@/context/resume-info-context';

function EditResume() {
    const {resumeId}=useParams();
    const [resumeInfo,setResumeInfo]=useState();
    useEffect(()=>{
       
        GetResumeInfo();
    },[])


    const GetResumeInfo=()=>{
        GlobalApi.GetResumeById(resumeId).then(resp=>{
          console.log(resp.data.data);
          setResumeInfo(resp.data.data);
        })
    }

  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
    <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
        {/* Form Section  */}
          <FormSection/>
        {/* Preview Section  */}
         <ResumePreview/>
    </div>
    </ResumeInfoContext.Provider>
  )
}

export default EditResume
