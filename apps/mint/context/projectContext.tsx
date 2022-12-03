import React from 'react'

interface ProjectDetail {
  projectName: string
  projectDescription: string
  projectOwner: string
  projectBanner: string
  projectProfileImage: string
  projectInfoBanner: string
  totalSupply: number
  ethPrice: number
  contractAddress: string
  maxAllocationPerAddress: number
}

const ProjectDetailContext = React.createContext<ProjectDetail | undefined>(undefined)

interface ProjectDetailProviderProps {
  data: ProjectDetail
  children: React.ReactNode
}

export function ProjectDetailProvider({ children, data }: ProjectDetailProviderProps) {
  return (
    <ProjectDetailContext.Provider value={{ ...data }}>
      {children}
    </ProjectDetailContext.Provider>
  )
}

export function useProjectDetail() {
  const context = React.useContext(ProjectDetailContext)

  if (context === undefined) {
    throw new Error('useProjectDetail must be used within ProjectDetailProvider')
  }

  return context
}
