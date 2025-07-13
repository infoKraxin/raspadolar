import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ticket, HelpCircle } from "lucide-react";

export default function Header() {
    return (
    <div
    className="w-screen border-b border-neutral-800">
        <div className="flex items-center justify-between mx-auto p-2 max-w-5xl">
            <div className="flex items-center gap-6">
                <Image
                src="/logo_rs.png"
                alt="logo"
                width={64}
                height={64}
                />
                
                <nav className=" items-center gap-2 hidden md:flex">
                    <a href="#raspadinhas" onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('raspadinhas');
                        if (element) {
                            const offsetTop = element.offsetTop - 80; // Offset para header
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 font-medium cursor-pointer">
                        <Ticket size={18} className="text-blue-400" />
                        <span>Raspadinhas</span>
                    </a>
                    <a href="#como-funciona" onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('como-funciona');
                        if (element) {
                            const offsetTop = element.offsetTop - 80; // Offset para header
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 font-medium cursor-pointer">
                        <HelpCircle size={18} className="text-neutral-600" />
                        <span>Como Funciona</span>
                    </a>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-blue-700 cursor-pointer">
                    Login
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    Registrar
                </Button>
            </div>
        </div>
    </div>
    )
}