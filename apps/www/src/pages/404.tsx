import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "src/components/layout/core/Layout";

const Page = () => {
  const { status } = useSession();
  return (
    <Layout>
      <Layout.Header authenticated={status === "authenticated"} />
      <Layout.Body>
        <div className="flex min-h-[calc(100vh-7rem)] w-full flex-col lg:relative">
          <div className="flex flex-grow flex-col">
            <main className="flex flex-grow flex-col bg-background">
              <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 sm:px-6 lg:px-8">
                <div className="my-auto flex-shrink-0 py-16 sm:py-32">
                  <p className="text-base font-semibold">404</p>
                  <h1 className="text-4xl font-bold sm:text-5xl">
                    page not found.
                  </h1>
                  <div className=" mt-4 flex flex-col">
                    <span className="text-sm font-semibold">
                      “Control can sometimes be an illusion.
                    </span>
                    <span className="text-sm font-semibold">
                      But sometimes you need illusion to gain control.” &#8212;
                      Mr. Robot
                    </span>
                  </div>
                  <div className="mt-2">
                    <Link href="/">
                      <div className="text-sm text-accents_5">
                        lets go somewhere<span aria-hidden="true"> &rarr;</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
          <div className="hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-1/2">
            <Image
              className="absolute inset-0 h-full object-cover"
              layout="fill"
              src="/images/protoglyph.png"
              alt="protoglyph-by-larvalabs"
            />
          </div>
        </div>
      </Layout.Body>
    </Layout>
  );
};

export default Page;
