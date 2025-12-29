import WebinarEditor from "@/components/WebinarEditor";

export default async function EditWebinarPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <WebinarEditor webinarId={id} />;
}
