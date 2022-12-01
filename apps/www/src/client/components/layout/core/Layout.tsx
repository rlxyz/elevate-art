import clsx from "clsx";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Header, { HeaderProps } from "./Header";

interface LayoutProps {
  children: React.ReactElement[] | React.ReactElement;
  hasFooter?: boolean;
}

export const LayoutContainer = ({
  className,
  children,
  border = "lower",
}: {
  border?: "upper" | "lower" | "none";
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "flex h-full w-full justify-center",
        className,
        border === "lower" && "border-b border-border",
        border === "upper" && "border-t border-border",
      )}
    >
      <div className="h-full w-[90%] lg:w-[70%] 2xl:w-[75%] 3xl:w-[65%]">
        {children}
      </div>
    </div>
  );
};

export const Layout = ({ children, hasFooter = true }: LayoutProps) => {
  return (
    <main className="layout">
      {children}
      {hasFooter ? (
        <LayoutContainer border="upper">
          <div className="flex min-h-[3.5rem] items-center">
            <Footer />
          </div>
        </LayoutContainer>
      ) : (
        <></>
      )}
      <Toaster />
    </main>
  );
};

const LayoutHeader = (props: HeaderProps) => (
  <LayoutContainer className="max-h-[5.64rem] min-h-[3.5rem]">
    <Header {...props} />
  </LayoutContainer>
);

const LayoutBody = ({
  children,
  border = "none",
}: {
  children: React.ReactNode[] | React.ReactNode;
  border?: "upper" | "lower" | "none";
}) => {
  const childrens = React.Children.toArray(children);
  return (
    <div className="min-h-[calc(100vh-9.14rem)]">
      <div className="h-full w-full space-y-8">
        {childrens.map((child, index) => {
          return (
            <LayoutContainer border={border} key={index}>
              {child}
            </LayoutContainer>
          );
        })}
      </div>
    </div>
  );
};

const LayoutTitle = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className="title">{children}</LayoutContainer>
);

Layout.Header = LayoutHeader;
Layout.Title = LayoutTitle;
Layout.Body = LayoutBody;
