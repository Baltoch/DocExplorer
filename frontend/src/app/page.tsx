'use client'

import axios from "axios";
import Card from "@/components/Card";
import SideMenu from "@/components/SideMenu";
import ToolBar from "@/components/ToolBar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import FormData from 'form-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export default function Home() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [jobs, setJobs] = useState<Array<any>>([]);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/jobs`).then((res) => {
        setJobs(res.data);
    })
    .catch((err) =>{
        console.error(err);
        return;
    });
  }, []);
  useEffect(() => {
    const form = new FormData();
    if(fileList) {
      form.append('file', new File([fileList[0]], `newFileName.${fileList[0].type}`, {
        type: fileList[0].type,
        lastModified: fileList[0].lastModified
      }));
      axios.post(`${BACKEND_URL}/files`, form, { headers: {'Content-Type': 'multipart/form-data'} }).catch((err) => {
          console.error(err);
          return;
      });
      const data = {
          status: "awaitingocr",
          userid: 1,
          result: null,
          images: fileList[0].name
      }
      axios.post(`${BACKEND_URL}/jobs`, JSON.stringify(data), { headers: {'Content-Type': 'application/json'}}).catch((err) => {
          console.error(err);
      })
    }
    
  }, [fileList])
  return (
    <main className="dark font-body flex min-h-screen flex-col items-center justify-center bg-neutral-900 dark:text-white">
      <TopBar className="fixed top-0 left-0 bg-neutral-900 z-10"/>
      <div className="w-full flex">
        <SideMenu className="fixed bottom-0 left-0 pt-16 z-20 opacity-0 lg:opacity-100"/>
        <div className="w-full px-8">
          <ToolBar setFileList={setFileList} className="w-full lg:w-[calc(100%-16rem)] fixed top-16 left-0 lg:left-64 px-8 bg-neutral-900 z-10"/>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pt-44 pb-8 lg:pl-64">
            {
              jobs.map((job, index) => (
                <Card key={index} title={job.id} imageSrc={BACKEND_URL + '/files/' + (job.result || job.images)} status={job.status} onDelete={()=>{}} onEdit={()=>{}} onDownload={()=>{}} />
              ))
            }
          </div>
        </div>
      </div>
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
