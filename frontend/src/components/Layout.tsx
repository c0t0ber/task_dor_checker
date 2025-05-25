import { NavLink, Outlet } from 'react-router-dom';
import { CheckCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">DoR Checker</h1>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Проверка задач</span>
                </NavLink>
                <NavLink
                  to="/dors"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  <span>Управление DoR</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-none">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 