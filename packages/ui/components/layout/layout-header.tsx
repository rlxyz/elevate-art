import Link from "next/link";
import { externalRoutes, socialRoutes } from "../elevateart-external-links";
import LayoutContainer from "./layout-container";

const LayoutHeader = (props: any) => (
  <LayoutContainer border="lower" className="min-h-[3.5rem] max-h-[5.64rem]">
    <header className="pointer-events-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs font-semibold space-x-1">
          {/* <Link
            className=""
            external={true}
            href={
              isLoggedIn ? `/${OrganisationNavigationEnum.enum.Dashboard}` : "/"
            }
          > */}
          {/* <Image
            priority
            width={50}
            height={50}
            src="/images/logo-black.png"
            alt="Logo"
          /> */}
          {/* </Link> */}
          {/* <HeaderInternalAppRoutes routes={internalRoutes} /> */}
        </div>
        <div className="flex flex-row justify-center items-center space-x-3">
          <div className="flex flex-row items-center justify-center space-x-3">
            {externalRoutes.map((item, index) => {
              return (
                <Link href={item.href}>{item.name}</Link>
                // <Link external={true} key={index} href={item.href}>
                // <article
                //   key={index}
                //   className="cursor-pointer hover:text-black text-xs text-darkGrey"
                // >
                // <div>hi</div>
                // </article>
                // </Link>
              );
            })}
            {socialRoutes.map((item, index) => (
              <article key={index} className="cursor-pointer">
                {/* <Link external={true} href={item.href}> */}
                {item.icon && (
                  <item.icon
                    className="h-4 w-4 text-darkGrey"
                    aria-hidden="true"
                  />
                )}
                {/* </Link> */}
              </article>
            ))}
          </div>
          {/* <ConnectButton /> */}
        </div>
      </div>
      {/* <HeaderInternalPageRoutes links={internalNavigation} /> */}
    </header>
  </LayoutContainer>
);

export default LayoutHeader;
