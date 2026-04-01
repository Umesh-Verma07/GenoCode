import logo from '../assets/logo.png'
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-10 border-t border-primary-300/40 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-5 py-6">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="OJ" className="h-9 w-9 rounded-lg" />
                    <div>
                        <p className="font-bold text-lg tracking-tight">GenoCode</p>
                        <p className="text-xs text-white/70">Where disciplined coders level up</p>
                    </div>
                </div>

                <ul className="flex-1 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/90">
                    <li><a href="#" className="hover:text-white transition">About</a></li>
                    <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-white transition">Licensing</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>

                <div className="flex gap-3">
                    <a href="https://github.com/" className="hover:text-orange-200 transition text-white text-lg"><FaGithub /></a>
                    <a href="https://twitter.com/" className="hover:text-orange-200 transition text-white text-lg"><FaTwitter /></a>
                    <a href="https://linkedin.com/" className="hover:text-orange-200 transition text-white text-lg"><FaLinkedin /></a>
                </div>
            </div>

            <div className="text-center text-xs text-white/75 border-t border-white/20 py-3">
                © 2026 GenoCode. All rights reserved.
            </div>
        </footer>
    );
}
