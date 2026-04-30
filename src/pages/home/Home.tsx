const Home = () => {
  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="flex justify-center px-4 mt-5 z-10">
        <div className="max-w-5xl w-full bg-zinc-700 rounded-2xl shadow-xl p-8">
          <div className="mb-6 flex justify-center">
            <img src="/echoes.png" alt="Echoes" className="max-h-48" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center">
            Easier Wuthering Waves Farming
          </h1>
          <p className="text-zinc-400 leading-relaxed text-center">
            Welcome to Echoes. With it, you can better organize your farming.
            Define goals for characters and weapons. Display your inventory and
            find our where and how much to farm materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
