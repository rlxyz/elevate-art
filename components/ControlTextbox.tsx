export const ControlTextbox = () => {
  return (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm w-[150px]">
        <div className="absolute inset-y-0 left-0 flex items-center px-4">
          <button className="text-2xl flex items-center">-</button>
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 px-4 sm:text-sm border-gray rounded-md text-center w-full h-10"
          placeholder="0"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-4">
          <button className="text-2xl flex items-center">+</button>
        </div>
      </div>
    </div>
  )
}
