import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge";
import { Pencil, Download, Trash2 } from "lucide-react";

export default function Card(props: {title: string; status: string; imageSrc: string; onDelete: Function; onEdit: Function; onDownload: Function}) {
    return (
        <div className="w-[268px] h-[232.75px] px-4 pb-4 rounded-md border border-neutral-500 flex-col justify-start items-center gap-2 inline-flex overflow-hidden">
            <iframe className="w-[268px] h-[150.75px] overflow-hidden" src={props.imageSrc} />
            <div className="w-[231px] justify-start items-center gap-2 inline-flex">
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
            <div className="w-[236px] pr-[173px] justify-start items-center inline-flex">
                <Badge className="h-4">{props.status}</Badge>
            </div>
        </div>
    );               
};