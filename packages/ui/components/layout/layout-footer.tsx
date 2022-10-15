import LayoutContainer from "./layout-container";

const Footer = () => {
  return (
    <LayoutContainer
      border="upper"
      className="min-h-[3.5rem] flex items-center"
    >
      <footer className="w-full flex items-center justify-between">
        <p className="text-center text-xs text-darkGrey">
          &copy; 2022 Elevate Art. All rights reserved.
        </p>
      </footer>
    </LayoutContainer>
  );
};
export default Footer;
