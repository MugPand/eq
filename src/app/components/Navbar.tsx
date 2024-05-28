import React from "react";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(45deg, white, purple, red)' }}>
            AB
        </div>
        <div className="flex items-center">
            <div className="mr-4">Profile Dashboard</div>
            <div className="relative">
            <select className="border border-gray-300 rounded-md p-2">
                <option value="">Select Age Range</option>
                <option value="10-20">10-20</option>
                <option value="21-30">21-30</option>
                <option value="31-40">31-40</option>
                <option value="41+">41+</option>
            </select>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;