import { OrganisationNavigationEnum } from "@utils/enums";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Card from "src/components/layout/card/Card";
import { Layout } from "src/components/layout/core/Layout";
import { ConnectButton } from "src/components/layout/eth/ConnectButton";
import LinkComponent from "src/components/layout/link/Link";
import NextLinkComponent from "src/components/layout/link/NextLink";

/**
 * Handles connection to the Ethereum wallet providers through rainbow-kit.
 * Also, redirect user after logged on.
 * Note: the server side props will ALSO redirect user to dashboard if already logged in.
 */
const Connect: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") router.push("/dashboard");
  return (
    <Layout hasFooter={false}>
      <Layout.Body>
        <div className="absolute left-0 top-0 flex min-h-screen w-full px-12 lg:grid lg:grid-cols-10 lg:gap-x-20 lg:px-0">
          <div className="relative col-span-3 hidden lg:block">
            <Image
              priority
              className="absolute inset-0 h-full object-cover"
              sizes="30vw"
              fill
              src="/images/refikanadol.jpeg"
              alt="refik-moma"
            />
            <NextLinkComponent href="/">
              <Image
                className="bg-black absolute left-5 top-5 cursor-pointer rounded-full border border-border p-2"
                width={50}
                height={50}
                src="/images/logo-white.png"
                alt="elevate-art-logo"
              />
            </NextLinkComponent>
          </div>
          <div className="relative col-span-4 flex w-full flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold">Connect your Wallet</h1>
              <p className="text-sm text-accents_6">
                Rainbow helps you connect. If your wallet is not supported here,
                please make a feature request at{" "}
                <LinkComponent
                  href="https://feature.elevate.art"
                  rel="noreferrer nofollow"
                  target="_blank"
                  className="w-fit"
                  icon
                  color
                  underline
                >
                  feature.elevate.art
                </LinkComponent>
              </p>
            </div>
            <ConnectButton>
              <Card>
                <div className="flex cursor-pointer flex-row items-center space-x-2">
                  <Image
                    src="/images/rainbow.png"
                    alt="rainbow-wallet"
                    width={35}
                    height={35}
                    className="rounded-primary"
                  />
                  <span className="font-semibold">Rainbow</span>
                </div>
              </Card>
            </ConnectButton>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  );
};

/**
 * If user is authenticated, redirect the user to his dashboard.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session?.user?.id) {
    return {
      redirect: {
        destination: `/${OrganisationNavigationEnum.enum.Dashboard}`,
        permanant: false,
      },
    };
  }
  return { props: {} };
}

export default Connect;
