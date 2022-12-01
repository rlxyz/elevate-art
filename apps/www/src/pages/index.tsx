import NextLink from "@components/layout/link/NextLink";
import { Layout, Link } from "@elevateart/ui";
import type { NextPage } from "next";
import Image from "next/image";

const Home: NextPage = () => (
  <Layout>
    <Layout.Header>
      <NextLink
        href="/connect"
        className="rounded-primary border border-border bg-foreground p-2 text-xs text-background"
      >
        Go to App
      </NextLink>
    </Layout.Header>
    <Layout.Body>
      <Layout.Body.Item border="none">
        <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center">
          <Image
            priority
            width={1200}
            height={285}
            sizes="50vw"
            src="/images/logo-banner.png"
            alt="elevate-art-logo-banner"
            className="h-auto w-1/2"
          />
          <span className="text-xs uppercase">
            an&nbsp;
            <Link
              underline
              href="https://twitter.com/rlxyz_eth"
              className="w-fit"
            >
              <span className="font-extrabold line-through">RLXYZ</span>
            </Link>
            &nbsp;production
          </span>
        </div>
      </Layout.Body.Item>
    </Layout.Body>
  </Layout>
);

export default Home;
