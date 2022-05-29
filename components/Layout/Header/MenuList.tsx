import { Fragment } from "react";

export const MenuList = [
  {
    name: (
      <Fragment>
        <span>Home</span>
      </Fragment>
    ),
    href: "https://reflections.dreamlab.art/",
  },
  {
    name: (
      <Fragment>
        <span>Story</span>
      </Fragment>
    ),
    href: "https://reflections.dreamlab.art/story",
  },
  {
    name: (
      <Fragment>
        <span>Dream Map</span>
      </Fragment>
    ),
    href: "https://reflections.dreamlab.art/dreammap",
  },
  {
    name: (
      <Fragment>
        <span>Mint</span>
      </Fragment>
    ),
    href: "/",
    active: true,
  },
];
