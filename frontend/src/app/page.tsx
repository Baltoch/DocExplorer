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

  useEffect(() => {
    const form = new FormData();
    form.append('file', fileList?fileList[0]:null);
    axios.post(`${BACKEND_URL}/files`, form, { headers: {'Content-Type': 'multipart/form-data'} }).catch((err) => {
        console.error(err);
        return;
    });
    console.log('here');
    const data = {
        status: "awaitingocr",
        userid: 1,
        result: null,
        images: fileList?fileList[0].name:null
    }
    console.log('there');
    axios.post(`${BACKEND_URL}/jobs`, JSON.stringify(data), { headers: {'Content-Type': 'application/json'}}).catch((err) => {
        console.error(err);
    })
    console.log('away');
  }, [fileList])

  let jobs: Array<any> = [];
  axios.get(`${BACKEND_URL}/jobs`).then((res) => {
      jobs = res.data;
  })
  .catch((err) =>{
      console.error(err);
      return;
  });
  return (
    <main className="dark font-body flex min-h-screen flex-col items-center justify-center bg-neutral-900 dark:text-white">
      <TopBar />
      <div className="w-full flex">
        <SideMenu />
        <div className="w-full px-8">
          <ToolBar setFileList={setFileList}/>
          <div className="flex flex-wrap h-[calc(100vh-11rem)] overflow-y-scroll justify-center gap-4">
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
