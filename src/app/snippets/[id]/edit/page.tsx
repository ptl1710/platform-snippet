import EditSnippetForm from "@/app/components/EditSnippetForm";

interface SnippetPageProps {
    params: Promise<{ id: string }>;
}

export default async function PageEdit({ params }: SnippetPageProps) {
    const { id } = await params;
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Edit Snippet</h1>
            <p className="mt-2 text-gray-600">This is the edit snippet page.</p>
            <EditSnippetForm id={id} />
        </div >
    );

}