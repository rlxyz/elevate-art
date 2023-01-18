import { useQueryContractDeployment } from '@components/explore/SaleLayout/useQueryContractDeployment'
import { Layout } from '@components/layout/core/Layout'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { AssetDeploymentBranch } from '@prisma/client'
import { ZoneNavigationEnum } from '@utils/enums'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { z } from 'zod'
import { CollectionLayout } from './CollectionLayout/CollectionLayout'
import { MintLayout } from './MintLayout/MintLayout'
import { MintPreviewWarningHeader } from './MintPreviewWarningHeader'
import { SaleLayoutLoading } from './SaleLayout/SaleLayoutLoading'

export const OrganisationNavigationEnum = z.nativeEnum(
  Object.freeze({
    Overview: 'overview',
    Mint: 'mint', // only for personal accounts
    Gallery: 'gallery', // only for personal accounts
  })
)
export type OrganisationNavigationType = z.infer<typeof OrganisationNavigationEnum>

export const Mint = ({ branch, address = '' }: { branch: AssetDeploymentBranch; address?: string | undefined | null }) => {
  const { current } = useQueryContractDeployment({ address })
  const { current: organisation } = useQueryContractDeployment({ address })
  const { current: repository } = useQueryContractDeployment({ address })
  return (
    <Layout>
      <Layout.AppHeader>
        <AppRoutesNavbar>
          <AppRoutesNavbar.Item
            label={current?.deployment.repository.organisation.name || ''}
            href={routeBuilder(current?.deployment.repository.organisation.name)}
            loading={!current?.deployment.repository.name || !current?.deployment.repository.organisation.name}
          />
          <AppRoutesNavbar.Item
            label={current?.deployment.repository.name || ''}
            href={routeBuilder(current?.deployment.repository.organisation.name, current?.deployment.repository.name)}
            loading={!current?.deployment.repository.name || !current?.deployment.repository.organisation.name}
          />
          <AppRoutesNavbar.Item label={capitalize(ZoneNavigationEnum.enum.Explore)} href={`/${ZoneNavigationEnum.enum.Explore}`} disabled>
            <ZoneRoutesNavbarPopover
              title='Apps'
              routes={[
                {
                  label: capitalize(ZoneNavigationEnum.enum.Create),
                  href: `/${ZoneNavigationEnum.enum.Create}`,
                  selected: false,
                  icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                },
                {
                  label: capitalize(ZoneNavigationEnum.enum.Deployments),
                  href: `/${ZoneNavigationEnum.enum.Deployments}`,
                  selected: false,
                  icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                },
                {
                  label: capitalize(ZoneNavigationEnum.enum.Explore),
                  href: `/${ZoneNavigationEnum.enum.Explore}`,
                  selected: true,
                  icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                },
              ]}
            />
          </AppRoutesNavbar.Item>
        </AppRoutesNavbar>
      </Layout.AppHeader>
      <Layout.PageHeader>
        <PageRoutesNavbar>
          {[
            {
              name: OrganisationNavigationEnum.enum.Mint,
              href: routeBuilder(
                current?.deployment.repository.organisation.name,
                current?.deployment.repository.name,
                branch === AssetDeploymentBranch.PREVIEW && ZoneNavigationEnum.enum.Explore,
                branch === AssetDeploymentBranch.PREVIEW && 'preview',
                branch === AssetDeploymentBranch.PREVIEW && current?.deployment.address,
                branch === AssetDeploymentBranch.PREVIEW && OrganisationNavigationEnum.enum.Mint
              ),
              enabled: true,
              loading: !current?.deployment.repository.name || !current?.deployment.repository.organisation.name,
            },
            {
              name: OrganisationNavigationEnum.enum.Gallery,
              href: routeBuilder(
                current?.deployment.repository.organisation.name,
                current?.deployment.repository.name,
                branch === AssetDeploymentBranch.PREVIEW && ZoneNavigationEnum.enum.Explore,
                branch === AssetDeploymentBranch.PREVIEW && 'preview',
                branch === AssetDeploymentBranch.PREVIEW && current?.deployment.address,
                OrganisationNavigationEnum.enum.Gallery
              ),
              enabled: false,
              loading: !current?.deployment.repository.name || !current?.deployment.repository.organisation.name,
            },
          ].map((item) => (
            <PageRoutesNavbar.Item key={item.name} opts={item} />
          ))}
        </PageRoutesNavbar>
      </Layout.PageHeader>
      <Layout.Body margin={false}>
        {branch === AssetDeploymentBranch.PREVIEW && current && current.deployment && current.deployment.assetDeployment && (
          <MintPreviewWarningHeader
            organisation={current.deployment.repository.organisation}
            repository={current.deployment.repository}
            assetDeployment={current.deployment.assetDeployment}
            contractDeployment={current.deployment}
          />
        )}

        <CollectionLayout>
          <CollectionLayout.Header repository={current?.deployment.repository} />
          <CollectionLayout.Description
            organisation={current?.deployment?.repository.organisation}
            repository={current?.deployment?.repository}
            deployment={current?.deployment?.assetDeployment}
            contractDeployment={current?.deployment}
            contractData={current?.contract}
          />
          <CollectionLayout.Body>
            <div className='w-full justify-center flex flex-col gap-6 md:grid md:grid-flow-col md:grid-cols-2'>
              {!current?.contract || !current.deployment ? (
                <>
                  <SaleLayoutLoading />
                  <SaleLayoutLoading />
                </>
              ) : (
                <MintLayout contractData={current?.contract} contractDeployment={current?.deployment} />
              )}
            </div>
          </CollectionLayout.Body>
        </CollectionLayout>
      </Layout.Body>
    </Layout>
  )
}
