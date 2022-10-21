import { PageContainer } from "@components/Layout/PageContainer";
import { ProjectInfo } from "@components/Minter/ProjectInfo";
import { MintSection } from "@components/MintSection/MintSection";
import { ProjectHeader } from "@components/ProjectHeader";
import { Spinner } from "@components/Spinner/Spinner";
import { useGetProjectDetail } from "@hooks/useGetProjectDetail";

export const Home = () => {
  const { data, isLoading } = useGetProjectDetail("rlxyz");

  if (isLoading) {
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <PageContainer
      header={
        <ProjectHeader
          bannerImageUrl={data?.projectBanner}
          profileImageUrl={data?.projectProfileImage}
          projectOwner={data?.projectOwner}
        />
      }
      leftContent={
        <ProjectInfo
          projectName={data?.projectName}
          projectDescription={data?.projectDescription}
          bannerImageUrl={data?.projectInfoBanner}
          discordUrl={data?.discordUrl}
          twitterUrl={data?.twitterUrl}
          openseaUrl={data?.openseaUrl}
          price={data?.ethPrice}
          supply={data?.totalSupply}
        />
      }
      rightContent={<MintSection />}
    />
  );
};
