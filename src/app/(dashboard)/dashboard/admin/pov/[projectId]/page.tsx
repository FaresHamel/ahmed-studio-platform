import PovProjectDetailsContainer from "@/containers/dashboard/admin/pov/PovProjectDetailsContainer";

interface PovProjectDetailsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function PovProjectDetailsPage({
  params
}: PovProjectDetailsPageProps) {
  const { projectId } = await params;

  return <PovProjectDetailsContainer key={projectId} projectId={projectId} />;
}
