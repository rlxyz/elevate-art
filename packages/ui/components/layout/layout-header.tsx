import LayoutContainer from "./layout-container";

const LayoutHeader = (props: any) => (
  <LayoutContainer border="lower" className="min-h-[3.5rem] max-h-[5.64rem]">
    <div className="-ml-2">{/* <Header connectButton {...props} /> */}</div>
  </LayoutContainer>
);

export default LayoutHeader;
