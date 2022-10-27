'use client'

const IngestButton = ({ address }: { address: string }) => {
  return (
    <button className='border border-accents_7 rounded-primary p-2 text-xs text-success' onClick={() => console.log('works')}>
      Ingest
    </button>
  )
}

export default IngestButton
