'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw, Upload } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction } from "react";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export default function ToolBar(props: {setFileList: Dispatch<SetStateAction<FileList | null>>; className?: string}) {
    const onUpload: ChangeEventHandler<HTMLInputElement> = (event:ChangeEvent<HTMLInputElement>) => {
        props.setFileList(event.target.files);
    }
    return (
        <div className={`w-full flex items-center justify-start gap-2 py-8 ${props.className}`}>
            <label htmlFor="searchbarinput" className="searchbar cursor-text grow flex gap-2 px-4 h-10 items-center border border-neutral-500 rounded-md has-[:focus-visible]:ring-white has-[:focus-visible]:ring-1">
                <Search className="h-4 w-4 dark:stroke-neutral-500 stroke-2"/>
                <Input id="searchbarinput" className="grow border-none p-0 dark:text-white dark:placeholder:text-neutral-500 focus-visible:ring-transparent text-sm" placeholder="Search" type="text"/>
            </label>
            <label htmlFor="upload" className="h-10 px-4 py-2 gap-2 cursor-pointer text-primary-foreground shadow dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white dark:active:bg-neutral-400 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <Upload className="h-4 w-4"/>
                <span className="hidden md:block">Upload</span>
                <input id="upload" type="file" accept=".png,.jpg,.jpeg,.tiff" onChange={onUpload} hidden/>
            </label>
            <Button className="h-10 gap-2 dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white dark:active:bg-neutral-400">
                <RefreshCcw className="h-4 w-4"/>
                <span className="hidden md:block">Refresh</span>
            </Button>
        </div>
    );
}