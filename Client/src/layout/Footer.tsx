import { NavLink, useLocation } from "react-router-dom";
import { LuHouse, LuGift, LuUsers, LuTrophy, LuWallet } from "react-icons/lu";

const Footer = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LuHouse, label: "Home", path: "/home" },
    { icon: LuUsers, label: "Friends", path: "/friends" },
    { icon: LuGift, label: "Earn", path: "/earn" },
    { icon: LuTrophy, label: "Leaderboard", path: "/leaderboard" },
    { icon: LuWallet, label: "Wallet", path: "/wallet" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted hover:bg-muted/20"
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Footer;