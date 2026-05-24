import CreateEditAssistantPage from '@/components/pages/user-dashboard/voice-assistants/components/pages/createEditAssistant';

export const dynamic = 'force-dynamic';

interface EditAssistantPageProps {
  params: Promise<{ id: string }>;
}

const EditAssistantRoute = async ({ params }: EditAssistantPageProps) => {
  const { id } = await params;
  const assistantId = Number(id);

  if (isNaN(assistantId)) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-error-400">شناسه دستیار معتبر نیست</p>
      </div>
    );
  }

  return <CreateEditAssistantPage assistantId={assistantId} />;
};

export default EditAssistantRoute;
