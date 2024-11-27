import useNavigateTo from "../../hooks/useNavigateTo";
import { House, ChartLine, Users } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { Button } from "../ui/button"
const Navbar = () => {
    const GoTo = useNavigateTo();
    const isMobile = useIsMobile();

    if (!isMobile) {
        return null;
    }

    return (
        <nav className="shadow-md bg-white fixed bottom-0 w-full">
            <div className="container mx-auto flex justify-center space-x-24 items-center">
                <div className="flex flex-col py-2 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => GoTo("/home-professor")}
                        className="px-4 py-1 rounded-lg hover:shadow-hover-custom hover:bg-orange-500 transition-all"
                    >
                         <House />
                    </Button>
                    
                    <label
                        onClick={() => GoTo("/home-professor")}
                        className="cursor-pointer text-sm"
                    >
                        Home
                    </label>
                </div>

                <div className="flex flex-col py-2 items-center">

                    <Button
                        variant="ghost"
                        size="icon"
                       onClick={() => GoTo("/chamada")}
                        className="px-4 py-1 rounded-lg hover:shadow-hover-custom hover:bg-orange-500 transition-all"
                    >
                         <ChartLine />
                    </Button>
                    <label
                        onClick={() => GoTo("/chamada")}
                        className="cursor-pointer text-sm"
                    >
                        Chamada
                    </label>
                </div>

                <div className="flex flex-col py-2 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => GoTo("/lista-atletas")}
                        className="px-4 py-1 rounded-lg hover:shadow-hover-custom hover:bg-orange-500 transition-all"
                    >
                        <Users />
                    </Button>


                    <label
                        onClick={() => GoTo("/lista-atletas")}
                        className="cursor-pointer text-sm"
                    >
                        Atletas
                    </label>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;