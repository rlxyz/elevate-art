import { NAMINGS } from "@utils/constant";

export const Title = () => {
  return (
    <>
      <div className="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex w">
            <p className="text-4xl text-white font-black text-indigo-600 sm:text-5xl">
              {NAMINGS.title}
            </p>
          </main>
        </div>
      </div>
    </>
  );
};
