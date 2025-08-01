"use client"
import { useEffect, useState } from "react"
import { ChevronDown, Menu, User, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import userPic from "@/assets/UserImage.svg"
import { useDispatch } from "react-redux"
import { logOut } from "@/features/auth/authSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"

export default function Header({ onMenuClick, onNavigate }) {
  const [welcomeText, setWelcomeText] = useState("");
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fullText = `Welcome Back, ${user?.name || 'User'}`;

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setWelcomeText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [fullText]);
  
  const handleLogout = async () => {
    try {
      // You might not need unwrap() if you don't need to handle the promise here
      dispatch(logOut());
      navigate("/"); // Redirect to home or login page after logout
    }
    catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="fixed top-0 right-0 z-30 left-0 lg:left-64 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
            {/* Left Section: Includes hamburger for mobile and title */}
            <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onMenuClick} 
                  className="lg:hidden" // Only show on screens smaller than lg (1024px)
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </Button>

                <div className="flex flex-col">
                    <h1 className="hidden md:block text-lg font-semibold text-gray-900 md:text-xl">
                        <span>{welcomeText.substring(0, 13)}</span>
                        {welcomeText.length > 13 && <span className="text-[#1987BF] font-bold">{welcomeText.substring(13)}</span>}
                        {welcomeText.length < fullText.length && <span className="animate-pulse text-gray-900">|</span>}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5 hidden md:block">
                        Here is the information about all your verifications
                    </p>
                </div>
            </div>

            {/* Right Section - Profile Dropdown */}
            <div className="flex items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 px-2 hover:bg-gray-100 flex items-center gap-2 rounded-full">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={userPic} alt={user?.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-medium">{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuItem onClick={() => onNavigate('profile')} className="flex items-center gap-2 cursor-pointer">
                           <User className="w-4 h-4" />
                           <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="flex items-center gap-2 cursor-not-allowed">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </header>
  )
}