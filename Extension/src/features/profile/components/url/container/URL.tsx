import DeleteUrl from "../components/delete-url/DeleteUrl"

const URL = ({url}:{url:string | null}) => {
  return (
    <li className="flex items-center justify-between w-full p-2 mb-2 text-lg font-bold text-white bg-blue-300 rounded">
      {url}
      <DeleteUrl url={url} />
    </li>
  )
}

export default URL
