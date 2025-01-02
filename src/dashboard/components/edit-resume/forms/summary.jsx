import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';
import { ResumeInfoContext } from '@/context/resume-info-context';

const prompt="Job Title: {jobTitle} , Depends on job title give me list of  summary for 3 experience level, Mid Level and Freasher level in 3-4 lines in array format, With summary and experience_level Field in JSON Format"
function Summary({enabledNext}) {
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
    const [summary,setsummary]=useState();
    const [loading,setLoading]=useState(false);
    const params=useParams();
    const [aiGeneratedsummaryList,setAiGeneratesummaryList]=useState();
    useEffect(()=>{
        summary&&setResumeInfo({
            ...resumeInfo,
            summary:summary
        })
    },[summary])

    const GeneratesummaryFromAI=async()=>{
        setLoading(true)
        const PROMPT=prompt.replace('{jobTitle}',resumeInfo?.jobTitle);
        console.log(PROMPT);
        const result=await AIChatSession.sendMessage(PROMPT);
        console.log(JSON.parse(result.response.text()))
       
        setAiGeneratesummaryList(JSON.parse(result.response.text()))
        setLoading(false);
    }

    const onSave=(e)=>{
        e.preventDefault();
       
        setLoading(true)
        const data={
            data:{
                summary:summary
            }
        }
        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
            console.log(resp);
            enabledNext(true);
            setLoading(false);
            toast("Details updated")
        },(error)=>{
            setLoading(false);
        })
    }
    return (
    <div>
         <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>summary</h2>
        <p>Add summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
            <div className='flex justify-between items-end'>
                <label>Add summary</label>
                <Button variant="outline" onClick={()=>GeneratesummaryFromAI()} 
                type="button" size="sm" className="border-primary text-primary flex gap-2"> 
                <Brain className='h-4 w-4' />  Generate from AI</Button>
            </div>
            <Textarea className="mt-5" required
            value={summary}
                defaultValue={summary?summary:resumeInfo?.summary}
            onChange={(e)=>setsummary(e.target.value)}
            />
            <div className='mt-2 flex justify-end'>
            <Button type="submit"
                disabled={loading}>
                    {loading?<LoaderCircle className='animate-spin' />:'Save'}
                    </Button>
            </div>
        </form>
        </div>

        
       {aiGeneratedsummaryList&& <div className='my-5'>
            <h2 className='font-bold text-lg'>Suggestions</h2>
            {aiGeneratedsummaryList?.map((item,index)=>(
                <div key={index} 
                onClick={()=>setsummary(item?.summary)}
                className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
                    <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
                    <p>{item?.summary}</p>
                </div>
            ))}
        </div>}

    </div>
  )
}

export default Summary