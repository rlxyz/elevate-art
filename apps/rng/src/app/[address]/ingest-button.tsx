'use client'

const IngestButton = ({ address }: { address: string }) => {
  return (
    <button className='border-accents_7 rounded-primary text-success border p-2 text-xs' onClick={() => console.log('works')}>
      Ingest
    </button>
  )
}

export default IngestButton
