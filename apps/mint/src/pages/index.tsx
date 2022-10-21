import { Home } from "@components/Pages/Home";
import Layout from "@elevateart/ui/components/layout";

export const HomePage = () => {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Body>
        <Home />
      </Layout.Body>
    </Layout>
  );
};

export default HomePage;
