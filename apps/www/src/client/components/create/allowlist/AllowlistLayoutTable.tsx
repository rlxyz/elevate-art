import { Table } from '@components/layout/core/Table'
import type { ContractDeployment, ContractDeploymentAllowlist } from '@prisma/client'
import { timeAgo } from 'src/client/utils/time'

export const AllowlistLayoutTable = ({
  contractDeployment,
  whitelist,
}: {
  contractDeployment: ContractDeployment
  whitelist: ContractDeploymentAllowlist[]
}) => {
  return (
    <Table>
      <Table.Head>
        <span>Id</span>
        <span>Mint Count</span>
        <span>Address</span>
        <span>Created At</span>
        <span>Update At</span>
      </Table.Head>
      <Table.Body>
        {whitelist?.map(({ address, mint, createdAt, updatedAt }, index) => (
          <Table.Body.Row current={index} key={address} total={whitelist.length}>
            <span>{index}</span>
            <span>{mint}</span>
            <span>{address}</span>
            <span>{timeAgo(createdAt)}</span>
            <span>{timeAgo(updatedAt)}</span>
          </Table.Body.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
