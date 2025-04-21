export default function sidebar() { 
  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-xl font-bold">Hôpital</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Patients
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Médecins
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Rendez-vous
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}