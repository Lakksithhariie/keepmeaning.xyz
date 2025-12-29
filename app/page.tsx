import ZenEditor from "@/components/ZenEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <nav className="p-6">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">keepmeaning.xyz</h1>
      </nav>
      
      <div className="flex-grow flex items-center justify-center">
        <ZenEditor />
      </div>
    </main>
  );
}