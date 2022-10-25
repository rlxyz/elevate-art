import * as React$1 from 'react';
import React__default, { ReactNode, FC, PropsWithChildren, HTMLAttributes, CSSProperties, Dispatch, SetStateAction, MutableRefObject } from 'react';
export { Toaster as Toast } from 'react-hot-toast';

interface Props$f {
    src?: string;
    stacked?: boolean;
    text?: string;
    isSquare?: boolean;
    className?: string;
}
declare type NativeAttrs$3 = Omit<Partial<React__default.ImgHTMLAttributes<any> & React__default.HTMLAttributes<any>>, keyof Props$f>;
declare type AvatarProps = Props$f & NativeAttrs$3;
declare const AvatarComponent: React__default.FC<AvatarProps>;

interface Props$e {
    count?: number;
    className?: string;
}
declare type NativeAttrs$2 = Omit<React__default.HTMLAttributes<any>, keyof Props$e>;
declare type AvatarGroupProps = Props$e & NativeAttrs$2;
declare const AvatarGroupComponent: React__default.FC<React__default.PropsWithChildren<AvatarGroupProps>>;

declare type AvatarComponentType = typeof AvatarComponent & {
    Group: typeof AvatarGroupComponent;
};

declare const _default$4: AvatarComponentType;

interface Props$d {
    separator?: string | ReactNode;
    className?: string;
}
declare type NativeAttrs$1 = Omit<React__default.HTMLAttributes<any>, keyof Props$d>;
declare type BreadcrumbsProps = Props$d & NativeAttrs$1;
declare const BreadcrumbsComponent: React__default.FC<React__default.PropsWithChildren<BreadcrumbsProps>>;

interface Props$c {
    href?: string;
    color?: boolean;
    icon?: boolean;
    underline?: boolean;
    block?: boolean;
    className?: string;
}
declare type LinkProps = Props$c & Omit<React__default.AnchorHTMLAttributes<any>, keyof Props$c>;
declare const LinkComponent: React__default.ForwardRefExoticComponent<Props$c & Omit<React__default.AnchorHTMLAttributes<any>, keyof Props$c> & {
    children?: React__default.ReactNode;
} & React__default.RefAttributes<HTMLAnchorElement>>;

interface Props$b {
    href?: string;
    nextLink?: boolean;
    onClick?: (event: React__default.MouseEvent) => void;
    className?: string;
}
declare const BreadcrumbsItemComponent: React__default.ForwardRefExoticComponent<Props$b & Omit<Omit<React__default.AnchorHTMLAttributes<any>, keyof Props$b>, keyof Props$c> & {
    children?: React__default.ReactNode;
} & React__default.RefAttributes<HTMLAnchorElement>>;

interface Props$a {
    className?: string;
}
declare type BreadcrumbsSeparatorProps = Props$a & Omit<React__default.HTMLAttributes<any>, keyof Props$a>;
declare const BreadcrumbsSeparatorComponent: React__default.FC<React__default.PropsWithChildren<BreadcrumbsSeparatorProps>>;

declare type BreadcrumbsComponentType = typeof BreadcrumbsComponent & {
    Item: typeof BreadcrumbsItemComponent;
    Separator: typeof BreadcrumbsSeparatorComponent;
};

declare const _default$3: BreadcrumbsComponentType;

interface Props$9 {
    className?: string;
}
declare type CardProps = Props$9 & Omit<React__default.HTMLAttributes<any>, keyof Props$9>;
declare const CardComponent: React__default.FC<React__default.PropsWithChildren<CardProps>>;

interface NavigationRoutes {
    name: string;
    href: string;
    disabled: boolean;
    icon?: (props: any) => JSX.Element;
}
declare const externalRoutes: NavigationRoutes[];
declare const socialRoutes: NavigationRoutes[];

declare const _default$2: "@heroicons/react/outline";

interface Props$8 {
    hasFooter?: boolean;
}
declare type LayoutProps = Props$8 & Omit<React.HTMLAttributes<any>, keyof Props$8>;
/**
 * Implements the Layout component. It is used to wrap the entire application.
 */
declare const LayoutComponent: React.FC<React.PropsWithChildren<LayoutProps>>;

interface Props$7 {
}
declare type LayoutBodyProps$1 = Props$7 & Omit<React.HTMLAttributes<any>, keyof Props$7>;
/**
 * Implements the LayoutBody component. Enforces that the body will be at least
 * the height of the viewport height minus the (footer + header) height.
 */
declare const LayoutBodyComponent: React.FC<React.PropsWithChildren<LayoutBodyProps$1>>;

interface Props$6 {
    border?: "lower" | "upper" | "none";
    hasMargin?: boolean;
}

interface Props$5 extends Props$6 {
}
declare type LayoutBodyProps = Props$5 & Omit<React.HTMLAttributes<any>, keyof Props$5>;
/**
 * Implements the LayoutBody component. Enforces that the body will be at least
 * the height of the viewport height minus the (footer + header) height.
 */
declare const LayoutBodyItemComponent: React.FC<React.PropsWithChildren<LayoutBodyProps>>;

interface Props$4 {
    appNavigationRoutes?: NavigationRoutes[];
    pageNavigationRoutes?: NavigationRoutes[];
    children?: React.ReactNode;
}
declare type LayoutContainerProps = Props$4 & Omit<HTMLAttributes<any>, keyof Props$4>;
/**
 * The core navigation component for applications.
 * There are three sections to this component:
 * - appNavigationRoutes: These are the routes that are always present in the header.
 * - pageNavigationRoutes: These are the routes that are specific to the page.
 *
 * Example:
 * - a landing page wouldnt have the pageNavigationRoutes.
 * - it would instantiate an empty array of appNavigationRoutes
 */
declare const LayoutHeaderComponent: FC<PropsWithChildren<LayoutContainerProps>>;

declare type LayoutBodyComponentType = typeof LayoutBodyComponent & {
    Item: typeof LayoutBodyItemComponent;
};
declare type LayoutComponentType = typeof LayoutComponent & {
    Body: LayoutBodyComponentType;
    Header: typeof LayoutHeaderComponent;
};

declare const _default$1: LayoutComponentType;

interface Props$3 {
    color?: string;
    className?: string;
    spaceRatio?: number;
}
declare type NativeAttrs = Omit<React__default.HTMLAttributes<any>, keyof Props$3>;
declare type LoadingProps = Props$3 & NativeAttrs;
declare const LoadingComponent: React__default.FC<React__default.PropsWithChildren<LoadingProps>>;

interface Props$2 {
    isLoading?: boolean;
    initialValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
declare type SearchProps = Props$2 & Omit<React.HTMLAttributes<any>, keyof Props$2>;
declare const SearchComponent: React.FC<React.PropsWithChildren<SearchProps>>;

interface Props$1 {
    initialValue?: string;
    value?: string;
    hideDivider?: boolean;
    hideBorder?: boolean;
    highlight?: boolean;
    onChange?: (val: string) => void;
    className?: string;
    leftSpace?: CSSProperties["marginLeft"];
    hoverHeightRatio?: number;
    hoverWidthRatio?: number;
    align?: CSSProperties["justifyContent"];
    activeClassName?: string;
    activeStyle?: CSSProperties;
}
declare type TabsProps = Props$1 & Omit<React__default.HTMLAttributes<any>, keyof Props$1>;
declare const TabsComponent: React__default.FC<React__default.PropsWithChildren<TabsProps>>;

interface Props {
    label: string | React__default.ReactNode;
    value: string;
    disabled?: boolean;
}
declare type TabsItemProps = Props & Omit<React__default.HTMLAttributes<any>, keyof Props>;
declare const TabsItemComponent: React__default.FC<React__default.PropsWithChildren<TabsItemProps>>;

declare type TabsComponentType = typeof TabsComponent & {
    Item: typeof TabsItemComponent;
    Tab: typeof TabsItemComponent;
};

declare const _default: TabsComponentType;

declare const useNotification: () => {
    notifySuccess: (message: React$1.ReactNode) => string;
    notifyError: (message: React$1.ReactNode) => string;
};

declare type BindingsChangeTarget = React__default.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string;
declare const useInput: (initialValue: string) => {
    state: string;
    setState: Dispatch<SetStateAction<string>>;
    currentRef: MutableRefObject<string>;
    reset: () => void;
    bindings: {
        value: string;
        onChange: (event: BindingsChangeTarget) => void;
    };
};

export { _default$4 as Avatar, _default$3 as Breadcrumbs, CardComponent as Card, _default$2 as Icons, _default$1 as Layout, LinkComponent as Link, LinkProps, LoadingComponent as Loading, NavigationRoutes, SearchComponent as Search, _default as Tabs, externalRoutes, socialRoutes, useInput, useNotification };
