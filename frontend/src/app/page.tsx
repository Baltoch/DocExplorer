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
  lastname: string
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
    refreshPage();
  }, []);
  useEffect(() => {
    const form = new FormData();
    if (fileList) {
      form.append('file', new File([fileList[0]], `${data?.user.id}-${data?.jobs.length}.${fileList[0].type.replace('image/', '')}`, {
        type: fileList[0].type,
        lastModified: fileList[0].lastModified
      }));
      axios.post(`${BACKEND_URL}/files`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
          const job = {
            title: fileList[0].name.split(".")[0],
            status: JobStatus.processing,
            userid: data?.user.id,
            result: null,
            images: `${data?.user.id}-${data?.jobs.length}.${fileList[0].type.replace('image/', '')}`
          }
          axios.post(`${BACKEND_URL}/jobs`, JSON.stringify(job), { headers: { 'Content-Type': 'application/json' } })
            .then((res) => {
              setTimeout(refreshPage, 100)
            })
            .catch((err) => {
              console.error(err);
            })
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    }

  }, [fileList])
  return (
    <main className="dark font-body flex min-h-screen bg-neutral-900 dark:text-white">
      <TopBar className="fixed top-0 left-0 bg-neutral-900 z-10" />
      <SideMenu className="fixed bottom-0 left-0 pt-16 z-20 hidden lg:flex" all={data?.jobs.length || 0} queuing={data?.Queuing || 0} processing={data?.Processing || 0} succeeded={data?.Succeeded || 0} failed={data?.Failed || 0} />
      <ToolBar onRefresh={refreshPage} setFileList={setFileList} className="w-full lg:w-[calc(100%-16rem)] fixed top-16 left-0 lg:left-64 px-8 bg-neutral-900 z-10" />
      <Suspense fallback={
        <div className="w-full mt-[10.5rem] lg:ml-64 p-8 pt-0 h-full flex justify-center align-middle">
          <span>Loading...</span>
        </div>
      }>
        <div className="w-full mt-[10.5rem] lg:ml-64 p-8 pt-0 h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {
            data?.jobs.map((job, index) => (
              <Card key={index}
                title={job.title}
                imageSrc={BACKEND_URL + '/files/' + (job.result || job.images)}
                status={job.status}
                onDelete={() => {
                  axios.delete(`${BACKEND_URL}/jobs/${job.id}`)
                  setTimeout(refreshPage, 200)
                }}
                onEdit={() => {
                  //window.location.replace(`/${job.id}`)
                }}
                onDownload={() => {

                  const link = document.createElement('a');

                  // Set the href attribute to the URL of the document
                  link.href = `${BACKEND_URL}/files/download/${job.result}`;

                  // Set the download attribute to specify the desired filename
                  link.download = `${job.title}.pdf`;

                  // Append the link to the document body
                  document.body.appendChild(link);

                  // Programmatically click the link to trigger the download
                  link.click();

                  // Remove the link from the document body after triggering the download
                  document.body.removeChild(link);
                }} />
            ))
          }
        </div>
      </Suspense>
    </main>
  );

  function refreshPage() {
    axios.get(`${BACKEND_URL}/users/1/load`).then((res) => {
      setData(res.data);
    })
      .catch((err) => {
        console.error(err);
        return;
      });
  }
}
