"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Avatar: () => avatar_default2,
  Breadcrumbs: () => breadcrumbs_default2,
  Card: () => card_default2,
  Icons: () => icons_default,
  Layout: () => layout_default2,
  Link: () => link_default2,
  Loading: () => loading_default2,
  Search: () => search_default2,
  Tabs: () => tabs_default2,
  Toast: () => import_react_hot_toast2.Toaster,
  externalRoutes: () => externalRoutes,
  socialRoutes: () => socialRoutes,
  useInput: () => useInput_default,
  useNotification: () => useNotification
});
module.exports = __toCommonJS(src_exports);

// src/avatar/avatar.tsx
var import_clsx = __toESM(require("clsx"));
var import_jsx_runtime = require("react/jsx-runtime");
var defaultProps = {
  stacked: false,
  text: "",
  isSquare: false,
  className: ""
};
var safeText = (text) => {
  if (text.length <= 4)
    return text;
  return text.slice(0, 3);
};
var AvatarComponent = ({
  src,
  stacked,
  text,
  isSquare,
  className,
  ...props
}) => {
  const showText = !src;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
    className: (0, import_clsx.default)(
      className,
      "inline-block relative overflow-hidden border border-border align-top bg-background box-border h-6 w-6 p-0",
      stacked && "ml-2.5",
      isSquare ? "rounded-primary" : "rounded-full"
    ),
    children: [
      !showText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
        alt: "avatar-img",
        className: (0, import_clsx.default)(
          "object-cover w-full select-none",
          isSquare ? "rounded-primary" : "rounded-full"
        ),
        src,
        draggable: false,
        ...props
      }),
      showText && text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
        className: (0, import_clsx.default)(
          "h-full flex justify-center text-xs items-center whitespace-nowrap select-none"
        ),
        ...props,
        children: safeText(text)
      })
    ]
  });
};
AvatarComponent.defaultProps = defaultProps;
AvatarComponent.displayName = "Avatar";
var avatar_default = AvatarComponent;

// src/avatar/avatar-group.tsx
var import_clsx2 = __toESM(require("clsx"));
var import_react = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var defaultProps2 = {
  className: ""
};
var AvatarGroupComponent = ({
  count,
  className,
  children
}) => {
  const childrens = import_react.default.Children.toArray(children);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", {
    className: (0, import_clsx2.default)(
      className,
      "flex items-center w-[max-content] h-auto p-0 m-0"
    ),
    children: [
      childrens.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", {
        className: (0, import_clsx2.default)(item !== 0 && "-mr-2"),
        children: item
      }, index)),
      count && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", {
        className: (0, import_clsx2.default)(
          "text-xs inline-flex items-center pl-3 text-foreground"
        ),
        children: [
          "+",
          count
        ]
      })
    ]
  });
};
AvatarGroupComponent.defaultProps = defaultProps2;
AvatarGroupComponent.displayName = "AvatarGroup";
var avatar_group_default = AvatarGroupComponent;

// src/avatar/index.tsx
avatar_default.Group = avatar_group_default;
var avatar_default2 = avatar_default;

// src/breadcrumbs/breadcrumbs.tsx
var import_clsx4 = __toESM(require("clsx"));
var import_react2 = __toESM(require("react"));

// src/breadcrumbs/breadcrumbs-separator.tsx
var import_clsx3 = __toESM(require("clsx"));
var import_jsx_runtime3 = require("react/jsx-runtime");
var defaultProps3 = {
  className: ""
};
var BreadcrumbsSeparatorComponent = ({
  children,
  className
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", {
    className: (0, import_clsx3.default)(
      className,
      "inline-flex pointer-events-none items-center w-auto h-auto mx-0.5"
    ),
    children
  });
};
BreadcrumbsSeparatorComponent.defaultProps = defaultProps3;
BreadcrumbsSeparatorComponent.displayName = "BreadcrumbsSeparator";
var breadcrumbs_separator_default = BreadcrumbsSeparatorComponent;

// src/breadcrumbs/breadcrumbs.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var defaultProps4 = {
  separator: "/",
  className: ""
};
var BreadcrumbsComponent = ({
  separator,
  children,
  className
}) => {
  const childrenArray = import_react2.default.Children.toArray(children);
  const withSeparatorChildren = childrenArray.map((item, index) => {
    if (!import_react2.default.isValidElement(item))
      return item;
    const last = childrenArray[index - 1];
    const lastIsSeparator = import_react2.default.isValidElement(last) && last.type === breadcrumbs_separator_default;
    const currentIsSeparator = item.type === breadcrumbs_separator_default;
    if (!lastIsSeparator && !currentIsSeparator && index > 0) {
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_react2.default.Fragment, {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(breadcrumbs_separator_default, {
            children: separator
          }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", {
            className: (0, import_clsx4.default)(index == childrenArray.length - 1 && "text-black"),
            children: item
          })
        ]
      }, index);
    }
    return item;
  });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("nav", {
    className: (0, import_clsx4.default)(
      className,
      "flex items-center text-xs w-auto h-auto text-foreground box-border"
    ),
    children: withSeparatorChildren
  });
};
BreadcrumbsComponent.defaultProps = defaultProps4;
BreadcrumbsComponent.displayName = "Breadcrumbs";
var breadcrumbs_default = BreadcrumbsComponent;

// src/breadcrumbs/breadcrumbs-item.tsx
var import_clsx6 = __toESM(require("clsx"));
var import_react6 = __toESM(require("react"));

// src/link/link.tsx
var import_clsx5 = __toESM(require("clsx"));
var import_react4 = __toESM(require("react"));

// src/link/icon.tsx
var import_react3 = __toESM(require("react"));
var import_jsx_runtime5 = require("react/jsx-runtime");
var LinkIconComponent = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", {
    viewBox: "0 0 24 24",
    width: "0.9375em",
    height: "0.9375em",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision",
    className: "inline-flex items-center mb-[0.1875em] ml-[2px]",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", {
        d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
      }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", {
        d: "M15 3h6v6"
      }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", {
        d: "M10 14L21 3"
      })
    ]
  });
};
LinkIconComponent.displayName = "GeistLinkIcon";
var LinkIcon = import_react3.default.memo(LinkIconComponent);
var icon_default = LinkIcon;

// src/link/link.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var defaultProps5 = {
  href: "",
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: ""
};
var LinkComponent = import_react4.default.forwardRef(
  ({
    href,
    color,
    underline,
    children,
    className,
    block,
    icon,
    ...props
  }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("a", {
      className: (0, import_clsx5.default)(
        "inline-flex items-baseline no-underline",
        "text-inherit w-fit h-auto",
        underline && "hover:underline hover:bg-accents_5",
        color && "text-success",
        block && "rounded-[5px] hover:bg-accents_8 px-3 py-2",
        block && color && "hover:bg-linkLighter",
        className
      ),
      href,
      ...props,
      ref,
      children: [
        children,
        icon && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(icon_default, {})
      ]
    });
  }
);
LinkComponent.defaultProps = defaultProps5;
LinkComponent.displayName = "Link";
var link_default = LinkComponent;

// src/link/index.tsx
var link_default2 = link_default;

// src/utils/collections.tsx
var import_react5 = __toESM(require("react"));
var pickChild = (children, targetChild) => {
  let target = [];
  const withoutTargetChildren = import_react5.default.Children.map(children, (item) => {
    if (!import_react5.default.isValidElement(item))
      return item;
    if (item.type === targetChild) {
      target.push(item);
      return null;
    }
    return item;
  });
  const targetChildren = target.length >= 0 ? target : void 0;
  return [withoutTargetChildren, targetChildren];
};
var isUIElement = (el) => {
  if (!el)
    return false;
  if ((el == null ? void 0 : el.dataset) && (el == null ? void 0 : el.dataset["ui"]))
    return true;
  el.attributes.getNamedItem("data-ui");
  return !!el.attributes.getNamedItem("data-ui");
};

// src/breadcrumbs/breadcrumbs-item.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var defaultProps6 = {
  nextLink: false,
  className: ""
};
var BreadcrumbsItemComponent = import_react6.default.forwardRef(
  ({
    href,
    nextLink,
    onClick,
    children,
    className,
    ...props
  }, ref) => {
    const isLink = (0, import_react6.useMemo)(
      () => href !== void 0 || nextLink,
      [href, nextLink]
    );
    const [withoutSepChildren] = pickChild(children, breadcrumbs_separator_default);
    const classes = (0, import_clsx6.default)(className, "inline-flex items-center");
    const clickHandler = (event) => {
      onClick && onClick(event);
    };
    if (!isLink) {
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", {
        className: (0, import_clsx6.default)(classes),
        onClick: clickHandler,
        children: withoutSepChildren
      });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(link_default2, {
      className: (0, import_clsx6.default)(classes, "hover:text-blueHighlight"),
      href,
      onClick: clickHandler,
      ref,
      ...props,
      children: withoutSepChildren
    });
  }
);
BreadcrumbsItemComponent.defaultProps = defaultProps6;
BreadcrumbsItemComponent.displayName = "BreadcrumbsItem";
var breadcrumbs_item_default = BreadcrumbsItemComponent;

// src/breadcrumbs/index.tsx
breadcrumbs_default.Item = breadcrumbs_item_default;
breadcrumbs_default.Separator = breadcrumbs_separator_default;
var breadcrumbs_default2 = breadcrumbs_default;

// src/card/card.tsx
var import_clsx7 = __toESM(require("clsx"));
var import_jsx_runtime8 = require("react/jsx-runtime");
var defaultProps7 = { className: "" };
var CardComponent = ({
  children,
  className,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", {
    className: (0, import_clsx7.default)(
      className,
      "bg-background transition-all rounded-primary box-border border border-border p-4"
    ),
    ...props,
    children
  });
};
CardComponent.defaultProps = defaultProps7;
CardComponent.displayName = "Card";
var card_default = CardComponent;

// src/card/index.tsx
var card_default2 = card_default;

// src/elevateart-external-links.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var externalRoutes = [
  {
    name: "Docs",
    disabled: false,
    href: "https://docs.elevate.art"
  },
  {
    name: "Features",
    disabled: false,
    href: "https://feature.elevate.art"
  }
];
var socialRoutes = [
  {
    name: "Twitter",
    disabled: false,
    href: "https://twitter.com/elevate_art",
    icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", {
        d: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
      })
    })
  },
  {
    name: "GitHub",
    disabled: false,
    href: "https://github.com/rlxyz",
    icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", {
        fillRule: "evenodd",
        d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
        clipRule: "evenodd"
      })
    })
  },
  {
    name: "Discord",
    disabled: false,
    href: "https://discord.gg/aC7spK59",
    icon: (props) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", {
      fill: "currentColor",
      width: "16",
      height: "16",
      viewBox: "0 0 71 55",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", {
        d: "M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      })
    })
  }
];

// src/icons/index.tsx
var icons_default = "@heroicons/react/outline";

// src/layout/layout-container.tsx
var import_clsx8 = __toESM(require("clsx"));
var import_jsx_runtime10 = require("react/jsx-runtime");
var defaultProps8 = {
  border: "lower",
  hasMargin: true
};
var LayoutContainerComponent = ({
  children,
  className,
  border,
  hasMargin,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("article", {
    ...props,
    className: (0, import_clsx8.default)(
      "flex justify-center h-full w-full",
      className,
      border === "lower" && "border-b border-border",
      border === "upper" && "border-t border-border"
    ),
    children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", {
      className: (0, import_clsx8.default)(
        hasMargin ? "w-[90%] lg:w-[70%] 2xl:w-[75%] 3xl:w-[65%] h-full" : "w-full h-full"
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", {
        className: "-ml-2",
        children
      })
    })
  });
};
LayoutContainerComponent.defaultProps = defaultProps8;
LayoutContainerComponent.displayName = "LayoutContainerComponent";
var layout_container_default = LayoutContainerComponent;

// src/layout/layout-footer.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var LayoutFooter = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("footer", {
    className: "w-full flex items-center justify-between",
    children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", {
      className: "text-center text-xs text-accents_5",
      children: "\xA9 2022 Elevate Art. All rights reserved."
    })
  });
};
LayoutFooter.displayName = "LayoutFooter";
var layout_footer_default = LayoutFooter;

// src/layout/layout.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var defaultProps9 = {
  hasFooter: true
};
var LayoutComponent = ({
  children,
  hasFooter,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("main", {
    ...props,
    className: "bg-background",
    children: [
      children,
      hasFooter ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(layout_container_default, {
        border: "upper",
        className: "min-h-[3.5rem] flex items-center",
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(layout_footer_default, {})
      }) : null
    ]
  });
};
LayoutComponent.defaultProps = defaultProps9;
LayoutComponent.displayName = "LayoutComponent";
var layout_default = LayoutComponent;

// src/layout/layout-body.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var defaultProps10 = {};
var LayoutBodyComponent = ({ children, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", {
    className: "min-h-[calc(100vh-9.14rem)]",
    ...props,
    children
  });
};
LayoutBodyComponent.defaultProps = defaultProps10;
LayoutBodyComponent.displayName = "LayoutBodyComponent";
var layout_body_default = LayoutBodyComponent;

// src/layout/layout-body-item.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
var defaultProps11 = {
  border: "lower",
  hasMargin: true
};
var LayoutBodyItemComponent = ({
  children,
  hasMargin,
  border,
  className,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(layout_container_default, {
    border,
    hasMargin,
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", {
      className,
      children
    })
  });
};
LayoutBodyItemComponent.defaultProps = defaultProps11;
LayoutBodyItemComponent.displayName = "LayoutBodyItemComponent";
var layout_body_item_default = LayoutBodyItemComponent;

// src/layout/layout-header.tsx
var import_clsx11 = __toESM(require("clsx"));

// src/tabs/tabs.tsx
var import_clsx9 = __toESM(require("clsx"));
var import_react11 = require("react");

// src/shared/highlight.tsx
var import_react9 = require("react");

// src/utils/useLayout.tsx
var import_react7 = require("react");
var getElementOffset = (el) => {
  if (!el)
    return {
      top: 0,
      left: 0
    };
  const { top, left } = el.getBoundingClientRect();
  return { top, left };
};
var defaultRect = {
  top: -1e3,
  left: -1e3,
  right: -1e3,
  width: 0,
  height: 0,
  elementTop: -1e3
};
var getRectFromDOMWithContainer = (domRect, getContainer) => {
  if (!domRect)
    return defaultRect;
  const container = getContainer ? getContainer() : null;
  const scrollElement = container || document.documentElement;
  const { top: offsetTop, left: offsetLeft } = getElementOffset(container);
  return {
    ...domRect,
    width: domRect.width || domRect.right - domRect.left,
    height: domRect.height || domRect.top - domRect.bottom,
    top: domRect.bottom + scrollElement.scrollTop - offsetTop,
    left: domRect.left + scrollElement.scrollLeft - offsetLeft,
    elementTop: domRect.top + scrollElement.scrollTop - offsetTop
  };
};
var isUnplacedRect = (rect) => {
  if (!rect)
    return true;
  return rect.top === defaultRect.top && rect.left === defaultRect.left;
};
var getRefRect = (ref, getContainer) => {
  if (!ref || !ref.current)
    return defaultRect;
  const rect = ref.current.getBoundingClientRect();
  return getRectFromDOMWithContainer(rect, getContainer);
};
var getEventRect = (event, getContainer) => {
  var _a;
  const rect = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.getBoundingClientRect();
  if (!rect)
    return defaultRect;
  return getRectFromDOMWithContainer(rect, getContainer);
};
var isRefTarget = (eventOrRef) => {
  return typeof (eventOrRef == null ? void 0 : eventOrRef.target) === "undefined";
};
var useRect = (initialState) => {
  const [rect, setRect] = (0, import_react7.useState)(
    initialState || defaultRect
  );
  const updateRect = (eventOrRef, getContainer) => {
    if (isRefTarget(eventOrRef))
      return setRect(getRefRect(eventOrRef, getContainer));
    setRect(getEventRect(eventOrRef, getContainer));
  };
  return {
    rect,
    setRect: updateRect
  };
};

// src/utils/usePrevious.tsx
var import_react8 = require("react");
var usePrevious = (state) => {
  const ref = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    ref.current = state;
  });
  return ref ? ref.current : null;
};
var usePrevious_default = usePrevious;

// src/shared/highlight.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var Highlight = ({
  rect,
  visible,
  hoverHeightRatio = 1,
  hoverWidthRatio = 1,
  activeOpacity = 0.8,
  className,
  ...props
}) => {
  const ref = (0, import_react9.useRef)(null);
  const isFirstVisible = usePrevious_default(isUnplacedRect(rect));
  const position = (0, import_react9.useMemo)(() => {
    const width = rect.width * hoverWidthRatio;
    const height = rect.height * hoverHeightRatio;
    return {
      width: `${width}px`,
      left: `${rect.left + (rect.width - width) / 2}px`,
      height: `${height}px`,
      top: `${rect.elementTop + (rect.height - height) / 2}px`,
      transition: isFirstVisible ? "opacity" : "opacity, width, left, top"
    };
  }, [rect, hoverWidthRatio, hoverHeightRatio]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", {
    ref,
    style: {
      width: position.width,
      left: position.left,
      height: position.height,
      top: position.top,
      opacity: visible ? activeOpacity : 0,
      transition: "0.15s ease",
      transitionProperty: position.transition
    },
    className: "absolute rounded-primary bg-accents_7",
    ...props
  });
};
var highlight_default = Highlight;

// src/tabs/tabs-context.ts
var import_react10 = __toESM(require("react"));
var defaultContext = {
  inGroup: false
};
var TabsContext = import_react10.default.createContext(defaultContext);
var useTabsContext = () => import_react10.default.useContext(TabsContext);

// src/tabs/tabs.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var defaultProps12 = {
  className: "",
  hideDivider: false,
  highlight: true,
  leftSpace: "12px",
  hoverHeightRatio: 0.7,
  hoverWidthRatio: 1.15,
  activeClassName: "",
  activeStyle: {},
  align: "left"
};
var TabsComponent = ({
  initialValue: userCustomInitialValue,
  value,
  hideDivider,
  hideBorder,
  children,
  onChange,
  className,
  leftSpace,
  highlight,
  hoverHeightRatio,
  hoverWidthRatio,
  activeClassName,
  activeStyle,
  align,
  ...props
}) => {
  const [tabs, setTabs] = (0, import_react11.useState)([]);
  const [selfValue, setSelfValue] = (0, import_react11.useState)(
    userCustomInitialValue
  );
  const ref = (0, import_react11.useRef)(null);
  const [displayHighlight, setDisplayHighlight] = (0, import_react11.useState)(false);
  const { rect, setRect } = useRect();
  const register = (next) => {
    setTabs((last) => {
      const hasItem = last.find((item) => item.value === next.value);
      if (!hasItem)
        return [...last, next];
      return last.map((item) => {
        if (item.value !== next.value)
          return item;
        return {
          ...item,
          ...next
        };
      });
    });
  };
  const initialValue = (0, import_react11.useMemo)(
    () => ({
      register,
      currentValue: selfValue,
      inGroup: true,
      leftSpace
    }),
    [selfValue, leftSpace]
  );
  (0, import_react11.useEffect)(() => {
    if (typeof value === "undefined")
      return;
    setSelfValue(value);
  }, [value]);
  const clickHandler = (value2) => {
    setSelfValue(value2);
    onChange && onChange(value2);
  };
  const tabItemMouseOverHandler = (event) => {
    if (!isUIElement(event.target))
      return;
    setRect(event, () => ref.current);
    if (highlight) {
      setDisplayHighlight(true);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(TabsContext.Provider, {
    value: initialValue,
    children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", {
      className: (0, import_clsx9.default)(className, "text-inherit w-initial h-auto p-0 m-0"),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("header", {
          className: "relative flex flex-nowrap items-center overflow-y-hidden overflow-x-scroll no-scrollbar",
          ref,
          onMouseLeave: () => setDisplayHighlight(false),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(highlight_default, {
              rect,
              visible: displayHighlight,
              hoverHeightRatio,
              hoverWidthRatio
            }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", {
              className: (0, import_clsx9.default)(
                "w-full h-full flex flex-1 flex-nowrap items-center border-b border-border",
                hideDivider && "border-transparent"
              ),
              style: { justifyContent: align, paddingLeft: leftSpace },
              children: tabs.map(({ cell: Cell, value: value2 }) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Cell, {
                onClick: clickHandler,
                onMouseOver: tabItemMouseOverHandler,
                activeClassName,
                activeStyle,
                hideBorder
              }, value2))
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", {
          children
        })
      ]
    })
  });
};
TabsComponent.defaultProps = defaultProps12;
TabsComponent.displayName = "Tabs";
var tabs_default = TabsComponent;

// src/tabs/tabs-item.tsx
var import_clsx10 = __toESM(require("clsx"));
var import_react12 = require("react");
var import_jsx_runtime17 = require("react/jsx-runtime");
var defaultProps13 = {
  disabled: false,
  label: "",
  value: ""
};
var TabsItemComponent = ({
  children,
  value,
  label,
  disabled
}) => {
  const { register, currentValue } = useTabsContext();
  const isActive = (0, import_react12.useMemo)(() => currentValue === value, [currentValue, value]);
  const TabsInternalCell = ({
    onClick,
    onMouseOver,
    activeClassName,
    activeStyle,
    hideBorder
  }) => {
    const ref = (0, import_react12.useRef)(null);
    const { currentValue: currentValue2 } = useTabsContext();
    const active = currentValue2 === value;
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", {
      ref,
      className: (0, import_clsx10.default)(
        "relative flex items-center box-border cursor-pointer bg-transparent",
        "w-auto h-auto py-3 px-2 mx-1 first-of-type:ml-0 z-1",
        "outline-none capitalize whitespace-nowrap select-none text-inherit leading-normal",
        "hover:text-foreground",
        "after:absolute after:content-[''] after:-bottom-[1px] after:left-0 after:right-0 after:w-full after:h-[2px] after:rounded-secondary after:bg-foreground after:text-foreground after:transition-['transition: opacity, transform 200ms ease-in'] after:opacity-0",
        active ? "after:opacity-100 after:scale-x-100" : "after:scale-x-75",
        active ? "text-foreground" : "text-accents_5",
        disabled && "cursor-not-allowed hover:text-accents_3",
        hideBorder && "before:block before:font-semibold before:height-0 before:overflow-hidden before:invisible after:hidden",
        hideBorder && active && "text-semibold"
      ),
      role: "button",
      onMouseOver,
      onClick: () => {
        if (disabled)
          return;
        onClick && onClick(value);
      },
      style: active ? activeStyle : {},
      "data-ui": "tab-item",
      children: label
    }, value);
  };
  TabsInternalCell.displayName = "TabsInternalCell";
  (0, import_react12.useEffect)(() => {
    register && register({ value, cell: TabsInternalCell });
  }, [value, label, disabled]);
  return isActive ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_jsx_runtime17.Fragment, {
    children
  }) : null;
};
TabsItemComponent.defaultProps = defaultProps13;
TabsItemComponent.displayName = "TabsItem";
var tabs_item_default = TabsItemComponent;

// src/tabs/index.ts
tabs_default.Item = tabs_item_default;
tabs_default.Tab = tabs_item_default;
var tabs_default2 = tabs_default;

// src/layout/layout-header.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var defaultProps14 = {
  appNavigationRoutes: [],
  pageNavigationRoutes: [],
  children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_jsx_runtime18.Fragment, {})
};
var LayoutHeaderComponent = ({
  appNavigationRoutes,
  pageNavigationRoutes,
  className,
  children,
  ...props
}) => {
  var _a;
  const appNavigationRoutesFinal = [
    {
      name: "Elevate Art",
      href: "/",
      disabled: false,
      icon: (props2) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("img", {
        width: 50,
        height: 50,
        src: "images/logo-black.png",
        ...props2
      })
    },
    ...appNavigationRoutes || []
  ];
  const externalNavigationRoutesFinal = [...externalRoutes, ...socialRoutes];
  const topNav = /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", {
    className: "flex justify-between items-center",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(breadcrumbs_default2, {
        className: "space-x-2",
        children: appNavigationRoutesFinal.map((item) => {
          return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(breadcrumbs_default2.Item, {
            href: item.href,
            children: item.icon ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(item.icon, {
              className: "h-8 w-8",
              "aria-hidden": "true"
            }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_jsx_runtime18.Fragment, {
              children: item.name
            })
          }, item.name);
        })
      }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", {
        className: "flex flex-row justify-center items-center space-x-3 text-xs",
        children: [
          externalNavigationRoutesFinal.map((item) => {
            return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(link_default2, {
              href: item.href,
              rel: "noreferrer nofollow",
              target: "_blank",
              className: "cursor-pointer hover:text-foreground text-xs text-accents_5",
              children: item.icon ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(item.icon, {
                className: "h-4 w-4",
                "aria-hidden": "true"
              }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", {
                children: item.name
              })
            }, item.href);
          }),
          children
        ]
      })
    ]
  });
  const bottomNav = pageNavigationRoutes && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(tabs_default2, {
    initialValue: (_a = pageNavigationRoutes[0]) == null ? void 0 : _a.name,
    hideDivider: true,
    children: pageNavigationRoutes == null ? void 0 : pageNavigationRoutes.map((route) => {
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(tabs_default2.Item, {
        label: route.name,
        value: route.name
      });
    })
  });
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(layout_container_default, {
    ...props,
    border: "lower",
    className: (0, import_clsx11.default)(
      className,
      "min-h-[3.5rem] max-h-[5.64rem] flex items-center whitespace-nowrap"
    ),
    children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("header", {
      children: topNav
    })
  });
};
LayoutHeaderComponent.defaultProps = defaultProps14;
LayoutHeaderComponent.displayName = "LayoutHeaderComponent";
var layout_header_default = LayoutHeaderComponent;

// src/layout/index.tsx
layout_body_default.Item = layout_body_item_default;
layout_default.Body = layout_body_default;
layout_default.Header = layout_header_default;
var layout_default2 = layout_default;

// src/loading/loading.tsx
var import_clsx12 = __toESM(require("clsx"));
var import_jsx_runtime19 = require("react/jsx-runtime");
var defaultProps15 = {
  className: "",
  spaceRatio: 1
};
var LoadingComponent = ({
  children,
  color,
  className,
  spaceRatio,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", {
    className: (0, import_clsx12.default)(
      className,
      "relative inline-flex justify-center items-center text-xs w-full h-full min-h-4 p-0 m-0"
    ),
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", {
      className: "absolute flex justify-center items-center bg-transparent select-none top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2",
      children: [
        children && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("label", {
          className: "mr-2 text-accents_5 leading-none",
          children
        }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("i", {
          className: "w-1 h-1 rounded-full inline-block bg-accents_5 animate-pulse",
          style: {
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`
          }
        }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("i", {
          className: "w-1 h-1 rounded-full inline-block bg-accents_5 animate-pulse",
          style: {
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
            animationDelay: "0.2s"
          }
        }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("i", {
          className: "w-1 h-1 rounded-full inline-block bg-accents_5 animate-pulse",
          style: {
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
            animationDelay: "0.4s"
          }
        })
      ]
    })
  });
};
LoadingComponent.defaultProps = defaultProps15;
LoadingComponent.displayName = "Loading";
var loading_default = LoadingComponent;

// src/loading/index.tsx
var loading_default2 = loading_default;

// src/search/search.tsx
var import_clsx13 = __toESM(require("clsx"));
var import_jsx_runtime20 = require("react/jsx-runtime");
var defaultProps16 = {
  isLoading: false,
  initialValue: ""
};
var SearchComponent = ({
  className,
  initialValue,
  onChange,
  onFocus,
  onBlur,
  isLoading,
  ...props
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", {
    className: "relative",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", {
        className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          strokeWidth: "1.5",
          stroke: "currentColor",
          className: (0, import_clsx13.default)(isLoading && "hidden", "w-4 h-4 text-accents_5"),
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          })
        })
      }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("input", {
        ...props,
        onChange: (e) => {
          onChange && onChange(e);
        },
        onFocus: (e) => {
          onFocus && onFocus(e);
        },
        onBlur: (e) => {
          onBlur && onBlur(e);
        },
        type: "text",
        className: (0, import_clsx13.default)(
          className,
          isLoading ? "bg-accents_7 bg-opacity-50 animate-pulse rounded-primary border-none" : "border border-border",
          "block text-xs w-full pl-8 rounded-primary py-2",
          "focus:outline-none focus:ring-1 focus:border-success focus:ring-success",
          "invalid:border-error invalid:text-error",
          "focus:invalid:border-error focus:invalid:ring-error"
        ),
        placeholder: isLoading ? "" : "Search"
      })
    ]
  });
};
SearchComponent.defaultProps = defaultProps16;
SearchComponent.displayName = "Search";
var search_default = SearchComponent;

// src/search/index.tsx
var search_default2 = search_default;

// src/toast/index.tsx
var import_react_hot_toast2 = require("react-hot-toast");

// src/toast/use-notification.tsx
var import_react_hot_toast = __toESM(require("react-hot-toast"));

// src/toast/toast-container.tsx
var import_clsx14 = __toESM(require("clsx"));
var import_jsx_runtime21 = require("react/jsx-runtime");
var ToastContainer = ({ children, id, type }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", {
    id,
    className: (0, import_clsx14.default)(
      type === "error" && "bg-error",
      type === "success" && "bg-success",
      "relative p-4 w-[350px] max-w-lg rounded-[5px] shadow-lg z-[1000]"
    ),
    role: "alert",
    children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", {
      className: "w-full flex items-center text-background text-xs",
      children
    })
  });
};

// src/toast/use-notification.tsx
var import_jsx_runtime22 = require("react/jsx-runtime");
var useNotification = () => {
  const notifySuccess = (message) => {
    return import_react_hot_toast.default.custom(
      (t) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(ToastContainer, {
        id: t.id,
        type: "success",
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", {
          className: "flex justify-between w-full items-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", {
            children: message
          })
        })
      }),
      {
        position: "bottom-right",
        duration: 2e3
      }
    );
  };
  const notifyError = (message) => {
    return import_react_hot_toast.default.custom(
      (t) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(ToastContainer, {
        id: t.id,
        type: "error",
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", {
          className: "flex justify-between w-full items-center",
          children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", {
            children: message
          })
        })
      }),
      {
        position: "bottom-right",
        duration: 2e3
      }
    );
  };
  return {
    notifySuccess,
    notifyError
  };
};

// src/utils/useCurrentState.tsx
var import_react13 = require("react");
var useCurrentState = (initialState) => {
  const [state, setState] = (0, import_react13.useState)(() => {
    return typeof initialState === "function" ? initialState() : initialState;
  });
  const ref = (0, import_react13.useRef)(initialState);
  (0, import_react13.useEffect)(() => {
    ref.current = state;
  }, [state]);
  const setValue = (val) => {
    const result = typeof val === "function" ? val(ref.current) : val;
    ref.current = result;
    setState(result);
  };
  return [state, setValue, ref];
};
var useCurrentState_default = useCurrentState;

// src/utils/useInput.tsx
var useInput = (initialValue) => {
  const [state, setState, currentRef] = useCurrentState_default(initialValue);
  return {
    state,
    setState,
    currentRef,
    reset: () => setState(initialValue),
    bindings: {
      value: state,
      onChange: (event) => {
        if (typeof event === "object" && event.target) {
        } else {
          setState(event);
        }
      }
    }
  };
};
var useInput_default = useInput;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Avatar,
  Breadcrumbs,
  Card,
  Icons,
  Layout,
  Link,
  Loading,
  Search,
  Tabs,
  Toast,
  externalRoutes,
  socialRoutes,
  useInput,
  useNotification
});
