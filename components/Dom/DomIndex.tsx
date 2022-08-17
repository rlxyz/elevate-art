import { Button } from '@components/UI/Button'
import { useNotification } from '@hooks/useNotification'

const DomIndex = () => {
  const { notifySuccess } = useNotification('repositoryName')
  return (
    <>
      <div className='max-w-max mx-auto h-[40%]'>
        <main className='w-full h-full'>
          Hi, nothing here. Go to /compiler/view/[id]
          <Button onClick={notifySuccess}>Notify</Button>
        </main>
      </div>
    </>
  )
}

export default DomIndex
