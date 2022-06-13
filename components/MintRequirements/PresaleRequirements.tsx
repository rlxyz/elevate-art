import {
  PresaleAllocation,
  PresaleTiming,
  TotalMinted,
  UserInAllowList,
} from '@components/MintRequirements'

export const PresaleRequirements = () => {
  return (
    <>
      <UserInAllowList />
      <TotalMinted />
      <PresaleTiming />
      <PresaleAllocation />
    </>
  )
}
