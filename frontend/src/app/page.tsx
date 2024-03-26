'use client'

import axios from "axios";
import Card from "@/components/Card";
import SideMenu from "@/components/SideMenu";
import ToolBar from "@/components/ToolBar";
import TopBar from "@/components/TopBar";
import { Suspense, useEffect, useRef, useState } from "react";
import FormData from 'form-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

enum JobStatus {
  queuing = 'Queuing',
  processing = 'Processing',
  succeeded = 'Succeeded',
  failed = 'Failed'
}

type Job = {
  title: string;
  images: string;
  result: string;
  id: number;
  userid: number;
  tags: object;
  status: JobStatus
}

type User = {
  id: number;
  email: string;
  password: string;
  tags: object;
  avatar: string;
  firstname: string;
  lastname:string
}

type Data = {
  user: User;
  jobs: Job[];
  Queuing: number;
  Processing: number;
  Succeeded: number;
  Failed: number
}

export default function Home() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/users/1/load`).then((res) => {
        setData(res.data);
    })
    .catch((err) =>{
        console.error(err);
        return;
    });
  }, []);
  useEffect(() => {
    const form = new FormData();
    if(fileList) {
      form.append('file', new File([fileList[0]], `${data?.user.id}-${data?.jobs.length}.${fileList[0].type.replace('image/', '')}`, {
        type: fileList[0].type,
        lastModified: fileList[0].lastModified
      }));
      axios.post(`${BACKEND_URL}/files`, form, { headers: {'Content-Type': 'multipart/form-data'} }).catch((err) => {
          console.error(err);
          return;
      });
      const job = {
          title: fileList[0].name,
          status: JobStatus.processing,
          userid: data?.user.id,
          result: null,
          images: `${data?.user.id}-${data?.jobs.length}.${fileList[0].type.replace('image/', '')}`
      }
      axios.post(`${BACKEND_URL}/jobs`, JSON.stringify(job), { headers: {'Content-Type': 'application/json'}}).catch((err) => {
          console.error(err);
      })
    }
    
  }, [fileList])
  return (
    <main className="dark font-body flex min-h-screen bg-neutral-900 dark:text-white">
      <TopBar className="fixed top-0 left-0 bg-neutral-900 z-10"/>
      <SideMenu className="fixed bottom-0 left-0 pt-16 z-20 opacity-0 lg:opacity-100" all={data?.jobs.length || 0} queuing={data?.Queuing || 0} processing={data?.Processing || 0} succeeded={data?.Succeeded || 0} failed={data?.Failed || 0}/>
      <ToolBar setFileList={setFileList} className="w-full lg:w-[calc(100%-16rem)] fixed top-16 left-0 lg:left-64 px-8 bg-neutral-900 z-10"/>
      <Suspense fallback={
        <div className="w-full mt-[10.5rem] lg:ml-64 p-8 pt-0 h-full flex justify-center align-middle">
          <span>Loading...</span>
        </div>
      }>
        <div className="w-full mt-[10.5rem] lg:ml-64 p-8 pt-0 h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {
            data?.jobs.map((job, index) => (
              <Card key={index} title={job.title} imageSrc={BACKEND_URL + '/files/' + (job.result || job.images)} status={job.status} onDelete={()=>{}} onEdit={()=>{}} onDownload={()=>{}} />
            ))
          }
        </div>
      </Suspense>
    </main>
  );

  // return (
  //   <main className="dark font-body flex min-h-screen flex-col items-center justify-center bg-neutral-900 dark:text-white">
  //     <TopBar />
  //     <div className="w-full flex">
  //       <SideMenu />
  //       <div className="w-full px-8">
  //         <ToolBar onUpload={function (event: ChangeEvent<HTMLInputElement>): void {
  //           throw new Error("Function not implemented.");
  //         } } />
  //         <div className="flex flex-wrap h-[calc(100vh-11rem)] overflow-y-scroll justify-center gap-4">
  //           <span>No documents yet...</span>
  //         </div>
  //       </div>
  //     </div>
  //   </main>
  // );
}
