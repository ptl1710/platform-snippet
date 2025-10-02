import CreateSnippetForm from "@/app/components/CreateSnippetForm";

export default function Page() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Create Snippet</h1>
            <p className="mt-2 text-gray-600">This is the create snippet page.</p>
            <CreateSnippetForm />
        </div >
    );

}