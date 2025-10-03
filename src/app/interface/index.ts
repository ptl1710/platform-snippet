export interface Topic {
    id: string;
    name: string;
    slug: string;
}

export interface User {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
    createdAt: string;
    snippets: {
        id: string;
        title: string;
        description?: string;
        language: string;
        code: string;
        createdAt: string;
    }[];
}

export interface Author {
    id: string;
    username: string;
    avatarUrl?: string;
}

export interface SnippetPageProps {
    params: Promise<{ id: string }>;
}

export interface Snippet {
    id: string;
    title: string;
    description: string | null;
    code: string;
    language: string;
    author: Author;
    topics: Topic[];
}