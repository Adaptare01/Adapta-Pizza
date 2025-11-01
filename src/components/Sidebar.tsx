import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Truck, Settings, Pizza } from "lucide-react";

const Sidebar = () => {
  const navLinkClasses =
    "flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg";
  const activeNavLinkClasses = "bg-primary text-primary-foreground";

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold flex items-center">
          <Pizza className="mr-2 h-6 w-6" />
          Pizza CRM
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${navLinkClasses} ${isActive ? activeNavLinkClasses : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
          }
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/vendas"
          className={({ isActive }) =>
            `${navLinkClasses} ${isActive ? activeNavLinkClasses : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
          }
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Vendas
        </NavLink>
        <NavLink
          to="/entregas"
          className={({ isActive }) =>
            `${navLinkClasses} ${isActive ? activeNavLinkClasses : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
          }
        >
          <Truck className="mr-3 h-5 w-5" />
          Entregas
        </NavLink>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `${navLinkClasses} ${isActive ? activeNavLinkClasses : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
          }
        >
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;