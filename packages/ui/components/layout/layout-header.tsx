import clsx from "clsx";
import Breadcrumbs from "components/breadcrumbs";
import Link from "components/link";
import { externalRoutes, socialRoutes } from "../elevateart-external-links";
import LayoutContainer from "./layout-container";

export interface HeaderInternalPageRoutesProps {
  links: { name: string; enabled: boolean; href: string }[];
}

const HeaderInternalPageRoutes = ({ links }: HeaderInternalPageRoutesProps) => {
  return (
    <aside>
      <ul className="flex list-none">
        {links.map(({ name, enabled, href }, index: number) => {
          return (
            <li
              key={index}
              className={
                enabled ? "flex space-between items-center relative" : ""
              }
            >
              <Link block href={href}>
                {name}
              </Link>
              {/* {enabled && (
                <motion.div
                  className="absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0"
                  layoutId="underline"
                />
              )} */}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export interface Props {
  internalRoutes?: {
    current: string;
    href: string;
    // organisations?: Organisation[];
  }[];
  internalNavigation?: {
    href: string;
    name: string;
    enabled: boolean;
    loading: boolean;
  }[];
  connectButton?: boolean;
}

const defaultProps: Props = {
  internalRoutes: [],
  internalNavigation: [],
  connectButton: false,
};

export type LayoutContainerProps = Props &
  Omit<React.HTMLAttributes<any>, keyof Props>;

const LayoutHeaderComponent: React.FC<
  React.PropsWithChildren<LayoutContainerProps>
> = ({
  className,
  children,
  ...props
}: React.PropsWithChildren<LayoutContainerProps>) => {
  return (
    <LayoutContainer
      {...props}
      border="lower"
      className={clsx(className, "min-h-[3.5rem] max-h-[5.64rem]")}
    >
      <header>
        <div className="flex justify-between items-center">
          <Breadcrumbs className="space-x-2">
            <Breadcrumbs.Item>
              <img
                className="object-cover w-8 h-8"
                src="https://elevate.art/_next/image?url=%2Fimages%2Flogo-black.png&w=128&q=75"
              />
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>sekured</Breadcrumbs.Item>
            <Breadcrumbs.Item>roboghost</Breadcrumbs.Item>
          </Breadcrumbs>
          <div className="flex flex-row justify-center items-center space-x-3">
            {[...externalRoutes, ...socialRoutes].map((item, index) => {
              return (
                <Link href={item.href}>
                  {item.icon ? (
                    <item.icon
                      className="h-4 w-4 text-darkGrey"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="text-darkGrey">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        <HeaderInternalPageRoutes
          links={[
            { name: "Preview", href: "/", enabled: false },
            { name: "Rarity", href: "/", enabled: false },
            { name: "Rules", href: "/", enabled: false },
          ]}
        />
      </header>
    </LayoutContainer>
  );
};

LayoutHeaderComponent.defaultProps = defaultProps;
LayoutHeaderComponent.displayName = "LayoutHeaderComponent";
export default LayoutHeaderComponent;
