import { Requirements } from "@components/MintRequirements/Requirements";
import React from "react";
import ReactMarkdown from "react-markdown";

import { SocialMediaLink } from "./SocialMediaLink";

interface ProjectInfoProps {
  projectName: string;
  projectDescription: string;
  bannerImageUrl: string;
  discordUrl?: string;
  twitterUrl?: string;
  openseaUrl?: string;
  supply: number;
  price: number;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({
  projectName,
  projectDescription,
  supply,
  price,
  bannerImageUrl,
  discordUrl,
  twitterUrl,
  openseaUrl,
}) => {
  return (
    <>
      <div className="flex flex-col mr-5">
        <div className="flex items-end mb-5">
          <h1 className="text-2xl font-bold mr-4">{projectName}</h1>
          <SocialMediaLink
            discordUrl={discordUrl}
            twitterUrl={twitterUrl}
            openseaUrl={openseaUrl}
          />
        </div>
        <div className="my-5 relative overflow-hidden h-[350px] w-full 2xl:h-[400px]">
          <div className="block absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border">
            <img
              alt={projectName}
              src={bannerImageUrl}
              className="absolute top-0 left-0 bottom-0 right-0 box-border p-0 m-auto w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="py-3">
          <div className="flex items-center mb-1">
            <img
              src="/images/supply.svg"
              className="inline-block mr-2"
              alt="Project Supply"
            />
            <span className="text-sm">{`${supply} Supply`}</span>
          </div>
          <div className="flex items-center">
            <img
              src="/images/price.svg"
              className="inline-block mr-2"
              alt="NFT Price"
            />
            <span className="text-sm">{`${price} ETH`}</span>
          </div>
          <div className="py-5">
            <ReactMarkdown>{projectDescription}</ReactMarkdown>
          </div>
        </div>
        <Requirements />
      </div>
    </>
  );
};
