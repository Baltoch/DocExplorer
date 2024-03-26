import { Button } from "@/components/ui/button";
import { File, Settings, Timer, CircleCheckBig, CircleX, BookOpen, ArrowUpRight, Mail, Github } from "lucide-react";

export default function SideMenu(props: {className?: string, all: number | null; queuing: number | null; processing: number | null; succeeded: number | null; failed: number | null}) {
    return (
        <div className={`flex flex-col w-64 min-w-64 h-full min-h-[calc(100vh-4rem)] border-r border-neutral-500 justify-start items-center ${props.className}`}>
            <div className="flex flex-col w-full border-b border-neutral-500 p-4 gap-2">
                <Button className="w-full flex-row gap-2 justify-start dark:text-white" variant="ghost">
                    <File className="h-4 w-4"/>
                    <span>All</span>
                    <span className="flex-auto text-right">{props.all}</span>
                </Button>
                <Button className="w-full flex-row gap-2 justify-start dark:text-white" variant="ghost">
                    <Timer className="h-4 w-4"/>
                    <span>Queuing</span>
                    <span className="flex-auto text-right">{props.queuing}</span>
                </Button>
                <Button className="w-full flex-row gap-2 justify-start dark:text-white" variant="ghost">
                    <Settings className="h-4 w-4"/>
                    <span>Processing</span>
                    <span className="flex-auto text-right">{props.processing}</span>
                </Button>
                <Button className="w-full flex-row gap-2 justify-start dark:text-white" variant="ghost">
                    <CircleCheckBig className="h-4 w-4"/>
                    <span>Succeeded</span>
                    <span className="flex-auto text-right">{props.succeeded}</span>
                </Button>
                <Button className="w-full flex-row gap-2 justify-start dark:text-white" variant="ghost">
                    <CircleX className="h-4 w-4"/>
                    <span>Failed</span>
                    <span className="flex-auto text-right">{props.failed}</span>
                </Button>
            </div>
            <div className="flex flex-col w-full p-4 gap-2">
            <a className="w-full h-9 px-4 py-2 dark:text-white inline-flex flex-row gap-2 justify-start items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground" href="https://github.com/Baltoch/DocExplorer" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="h-4 w-4"/>
                    <span className="grow">Documentation</span>
                    <ArrowUpRight className="h-4 w-4"/>
                </a>
                <a className="w-full h-9 px-4 py-2 dark:text-white inline-flex flex-row gap-2 justify-start items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground" href="https://github.com/Baltoch/DocExplorer" target="_blank" rel="noopener noreferrer">
                    <Mail className="h-4 w-4"/>
                    <span className="grow">Contact us</span>
                    <ArrowUpRight className="h-4 w-4"/>
                </a>
                <a className="w-full h-9 px-4 py-2 dark:text-white inline-flex flex-row gap-2 justify-start items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground" href="https://github.com/Baltoch/DocExplorer" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4"/>
                    <span className="grow">Source Code</span>
                    <ArrowUpRight className="h-4 w-4"/>
                </a>
            </div>
        </div>
    );
}
