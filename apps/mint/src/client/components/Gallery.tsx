import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { GalleryLayout } from '@Components/GalleryLayout/GalleryLayout'
import { MintPreviewWarningHeader } from '@Components/MintPreviewWarningHeader'
import { Layout } from '@Components/ui/core/Layout'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { AssetDeploymentBranch } from '@prisma/client'
import { capitalize, routeBuilder } from '@Utils/format'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { ZoneNavigationEnum } from 'src/shared/enums'
import { OrganisationNavigationEnum } from './Mint'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from './ui/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from './ui/header/PageRoutesNavbar'
import { TriangleIcon } from './ui/icons/RectangleGroup'

export const Gallery = ({ type }: { type: AssetDeploymentBranch }) => {
  const router = useRouter()
  const { organisation, repository, address } = router.query as { [key: string]: string }
  const { current } = useQueryContractDeployment()
  return (
    <Layout>
      <Layout.AppHeader>
        <AppRoutesNavbar>
          <AppRoutesNavbar.Item label={capitalize(ZoneNavigationEnum.enum.Explore)} href={`/${ZoneNavigationEnum.enum.Explore}`}>
            <ZoneRoutesNavbarPopover
              title='Apps'
              routes={[
                {
                  label: capitalize(ZoneNavigationEnum.enum.Dashboard),
                  href: `/${ZoneNavigationEnum.enum.Dashboard}`,
                  selected: false,
                  icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                },
                {
                  label: capitalize(ZoneNavigationEnum.enum.Create),
                  href: `/${ZoneNavigationEnum.enum.Create}`,
                  selected: true,
                  icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                },
                {
                  label: capitalize(ZoneNavigationEnum.enum.Explore),
                  href: `/${ZoneNavigationEnum.enum.Explore}`,
                  selected: false,
                  icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                },
              ]}
            />
          </AppRoutesNavbar.Item>
          <AppRoutesNavbar.Item
            label={current?.deployment.repository.organisation.name || ''}
            href={routeBuilder(
              current?.deployment.repository.organisation.name,
              current?.deployment.repository.organisation.name,
              type === AssetDeploymentBranch.PREVIEW && 'preview',
              type === AssetDeploymentBranch.PREVIEW && current?.deployment.address,
              OrganisationNavigationEnum.enum.Mint
            )}
          />
          <AppRoutesNavbar.Item
            label={current?.deployment.repository.name || ''}
            href={routeBuilder(
              current?.deployment.repository.organisation.name,
              current?.deployment.repository.organisation.name,
              type === AssetDeploymentBranch.PREVIEW && 'preview',
              type === AssetDeploymentBranch.PREVIEW && current?.deployment.address,
              OrganisationNavigationEnum.enum.Mint
            )}
          />
        </AppRoutesNavbar>
      </Layout.AppHeader>
      <Layout.PageHeader>
        <PageRoutesNavbar>
          {[
            {
              name: OrganisationNavigationEnum.enum.Mint,
              href: routeBuilder(
                current?.deployment.repository.organisation.name,
                current?.deployment.repository.organisation.name,
                type === AssetDeploymentBranch.PREVIEW && 'preview',
                type === AssetDeploymentBranch.PREVIEW && current?.deployment.address,
                OrganisationNavigationEnum.enum.Mint
              ),
              enabled: false,
              loading: false,
            },
            {
              name: OrganisationNavigationEnum.enum.Gallery,
              href: routeBuilder(
                current?.deployment.repository.organisation.name,
                current?.deployment.repository.organisation.name,
                type === AssetDeploymentBranch.PREVIEW && 'preview',
                type === AssetDeploymentBranch.PREVIEW && current?.deployment.address,
                OrganisationNavigationEnum.enum.Gallery
              ),
              enabled: true,
              loading: false,
            },
          ].map((item) => (
            <PageRoutesNavbar.Item key={item.name} opts={item} />
          ))}
        </PageRoutesNavbar>
      </Layout.PageHeader>
      <Layout.Body margin={false}>
        <>
          {type === AssetDeploymentBranch.PREVIEW && current && current.deployment && current.deployment.assetDeployment && (
            <MintPreviewWarningHeader
              organisation={current.deployment.repository.organisation}
              repository={current.deployment.repository}
              assetDeployment={current.deployment.assetDeployment}
              contractDeployment={current.deployment}
            />
          )}
        </>

        <CollectionLayout>
          <CollectionLayout.Header contractDeployment={current?.deployment} />
          <CollectionLayout.Description
            organisation={current?.deployment?.repository?.organisation}
            repository={current?.deployment?.repository}
            deployment={current?.deployment?.assetDeployment}
            contractDeployment={current?.deployment}
            contractData={current?.contract}
          />
          <CollectionLayout.Body>
            {current && current.deployment && current.deployment.assetDeployment && (
              <GalleryLayout
                organisation={current?.deployment?.repository?.organisation}
                repository={current?.deployment?.repository}
                assetDeployment={current?.deployment?.assetDeployment}
                contractDeployment={current?.deployment}
                contractData={current?.contract}
              />
            )}
          </CollectionLayout.Body>
        </CollectionLayout>
      </Layout.Body>
    </Layout>
  )
}
