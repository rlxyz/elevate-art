import Card from '@elevateart/ui/components/card'
import Layout from '@elevateart/ui/components/layout'
import Image from 'next/image'

const Connect = () => {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Body>
        <Layout.Body.Item border='none'>
          <div className='w-full min-h-[calc(100vh-7rem)] flex lg:grid lg:grid-cols-2 gap-x-12'>
            <div className='hidden lg:block relative'>
              <Image
                className='absolute inset-0 h-full object-cover'
                layout='fill'
                src='/images/protoglyph.png'
                alt='protoglyph-by-larvalabs'
              />
            </div>
            <div className='w-full flex flex-col justify-center space-y-3'>
              <div className='space-y-1'>
                <h1 className='text-xl font-semibold'>Connect your Wallet</h1>
                <p className='text-xs text-accents_6'>Apparently, this thing called Rainbow that does everything for you.</p>
              </div>
              <Card>
                <div className='flex flex-row items-center space-x-2 cursor-pointer'>
                  <img src='images/rainbow.png' className='w-10 h-10 rounded-primary' />
                  <span className='font-semibold'>Rainbow</span>
                </div>
              </Card>
            </div>
          </div>
        </Layout.Body.Item>
      </Layout.Body>
    </Layout>
  )
}

export default Connect
