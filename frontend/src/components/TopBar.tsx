import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TopBar(props: {className?: string}) {
    return  (
        <div className={`h-16 w-full flex justify-start items-center dark:text-white border-b dark:border-b-neutral-500 ${props.className}`}>
            <span className="h-full w-64 text-3xl font-display flex justify-center items-center pr-4 lg:border-r dark:border-r-neutral-500">DocExplorer</span>
            <div className="grow"></div>
            <Avatar className="mr-8">
                <AvatarImage/>
                <AvatarFallback>DE</AvatarFallback>
            </Avatar>
        </div>
    );
}