import * as React from "react";
import { Seo } from "./Seo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import Socials from "./Socials";
import { LSnapshot, RSnapshot } from "./Snapshot";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Seo />
      <div className="absolute top-0 left-0 h-full w-full pointer-events-auto">
        <main className="w-full h-full flex justify-center items-center md:p-4 lg:p-8 xl:p-3 2xl:p-4">
          <div
            className={`w-full h-full relative flex justify-center items-center`}
          >
            <Socials />
            {/* <LSnapshot /> */}
            {/* <RSnapshot /> */}
            <Header />
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
};
