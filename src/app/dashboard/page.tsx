import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (<>
        <section className="w-screen flex flex-col items-center justify-center">
            <div className="w-[70%] mt-8 border-b-2 p-2">
                <div className="flex flex-col w-fit items-start">
                    <Button className="m-2 text-lg p-5">Create</Button>
                    <div className="px-2">
                        Create new session to start programming collaboratively.
                    </div>
                </div>
            </div>
            <div className="w-[70%] p-4">
                <span className="text-2xl font-semibold">
                    Previous Sessions
                </span>
            </div>
        </section>
    </>)
}