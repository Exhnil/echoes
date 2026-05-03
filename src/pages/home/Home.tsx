import type { ChangelogEntry } from "@/types";

const Home = () => {
  const changelog: ChangelogEntry[] = [];

  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="flex flex-col items-center px-4 mt-5 z-10 gap-4">
        <div className="max-w-5xl w-full bg-zinc-700 rounded-2xl shadow-xl p-8">
          <div className="mb-6 flex justify-center">
            <img src="/echoes.png" alt="Echoes" className="max-h-48" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center">
            Easier Wuthering Waves Farming
          </h1>
          <p className="text-zinc-300 leading-relaxed text-center">
            Welcome to Echoes. With it, you can better organize your farming.
            Define goals for characters and weapons. Display your inventory and
            find our where and how much to farm materials.
          </p>
        </div>
        <div className="max-w-5xl w-full space-y-2">
          <h2 className="text-lg font-semibold mb-2">Changelog</h2>
          <div className="rounded-xl bg-zinc-700 p-8">
            {changelog.length === 0 ? (
              <p className="text-sm text-zinc-300">
                No updates yet. This is where site feature changes will appear
              </p>
            ) : (
              <ul className="space-y-3">
                {changelog.map((entry) => (
                  <li>
                    <p>{entry.date}</p>
                    <p>{entry.title}</p>
                    <p>{entry.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
