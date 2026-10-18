import { Sidebar } from "@/components/sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen mesh-gradient text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
