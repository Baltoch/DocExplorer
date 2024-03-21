import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge";
import { Pencil, Download, Trash2 } from "lucide-react";

export default function Card(props: {title: string; status: string; imageSrc: string; onDelete: Function; onEdit: Function; onDownload: Function; className?: string}) {
    return (
        <div className={`col-span-1 inline-flex flex-col justify-start items-center gap-4 pb-4 rounded-md border border-neutral-500 overflow-hidden ${props.className}`}>
            <div className="w-full h-38 overflow-hidden">
                <iframe className="w-full h-38 overflow-hidden" src={props.imageSrc} />
            </div>
            <div className="w-full px-4 flex flex-col gap-2">
                <div className="w-full justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 text-white text-2xl font-semibold leading-8 line-clamp-1 h-8">{props.title || "lorem"}</div>
                    <Button size="icon" className="w-8 h-8 dark:bg-neutral-800 dark:hover:bg-neutral-700" onClick={props.onEdit()}>
                        <Pencil className="dark:invert h-4 w-4"/>
                    </Button>
                    <Button size="icon" className="w-8 h-8 dark:bg-neutral-800 dark:hover:bg-neutral-700" onClick={props.onDownload()}>
                            <Download className="dark:invert h-4 w-4"/>
                    </Button>
                    <Button size="icon" className="w-8 h-8 dark:bg-neutral-800 dark:hover:bg-neutral-700" onClick={props.onDelete()}>
                        <Trash2 className="dark:invert h-4 w-4"/>
                    </Button>
                </div>
                <div className="w-full justify-start items-center inline-flex">
                    <Badge className="h-4">{props.status}</Badge>
                </div>
            </div>
        </div>
    );               
};