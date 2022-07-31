import React from 'react'

interface ProjectHeaderProps {
  bannerImageUrl: string
  profileImageUrl: string
  projectOwner: string
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  bannerImageUrl,
  profileImageUrl,
  projectOwner,
}) => {
  return (
    <>
      <div className="relative max-h-[300px] overflow-hidden">
        <div className="h-0 pb-[25%]">
          <div className="block absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border">
            <img
              src={bannerImageUrl}
              alt="Project Banner"
              className="absolute top-0 left-0 bottom-0 right-0 box-border p-0 m-auto w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="py-0 px-5 lg:px-16 2xl:px-32 w-full">
        <div className="inline-flex -mt-28 mb-4 w-[150px] h-[150px] basis-44 rounded-2xl relative bg-white z-[1] border-2 border-solid border-white">
          <div className="block overflow-hidden absolute box-border m-0 inset-0">
            <img
              src={profileImageUrl}
              className="absolute inset-0 p-0 border-none m-auto block w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
              alt={projectOwner}
            />
          </div>
        </div>
      </div>
    </>
  )
}
