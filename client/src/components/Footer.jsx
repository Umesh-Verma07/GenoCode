import logo from '../assets/logo.png'
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-primary-800 border-t border-primary-400/50">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4">
                {/* Logo Left */}
                <div className="flex items-center gap-2 w-1/3 justify-start">
                    <img src={logo} alt="OJ" className="h-6 w-6" />
                    <span className="font-semibold text-white text-base tracking-tight">GenoCode</span>
                </div>
                {/* Center Links */}
                <ul className="flex-1 flex justify-center gap-6 text-sm font-medium text-white">
                    <li><a href="#" className="hover:text-yellow-200 transition">About</a></li>
                    <li><a href="#" className="hover:text-yellow-200 transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-yellow-200 transition">Licensing</a></li>
                    <li><a href="#" className="hover:text-yellow-200 transition">Contact</a></li>
                </ul>
                {/* Social Icons Right */}
                <div className="flex gap-3 w-1/3 justify-end">
                    <a href="https://github.com/" className="hover:text-yellow-200 transition text-white text-lg"><FaGithub /></a>
                    <a href="https://twitter.com/" className="hover:text-yellow-200 transition text-white text-lg"><FaTwitter /></a>
                    <a href="https://linkedin.com/" className="hover:text-yellow-200 transition text-white text-lg"><FaLinkedin /></a>
                </div>
            </div>
            {/* Copyright */}
            <div className="text-center text-xs text-white/80 border-t border-primary-400/50 py-2">
                © 2025 GenoCode™. All Rights Reserved.
            </div>
        </footer>
    );
}
