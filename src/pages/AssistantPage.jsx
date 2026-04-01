import { PageContainer } from "../components/layout/PageContainer";

export const AssistantPage = () => (
  <PageContainer
    title="AI Assistant"
    subtitle="Use the floating chat widget at the bottom-right to ask about skills, projects, and profile."
  >
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-slate-300">
        Example prompts:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-200">
        <li>What skills does Rohan have?</li>
        <li>What featured projects has he built?</li>
        <li>Is he a full stack developer?</li>
      </ul>
    </div>
  </PageContainer>
);

