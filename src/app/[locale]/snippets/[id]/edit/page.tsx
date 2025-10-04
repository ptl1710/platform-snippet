import EditSnippetForm from "@/app/components/EditSnippetForm";
import { SnippetPageProps } from "@/app/interface";

export default async function PageEdit({ params }: SnippetPageProps) {
    const { id } = await params;
    return (
        <div className="p-4">
            <EditSnippetForm id={id} />
        </div >
    );

}