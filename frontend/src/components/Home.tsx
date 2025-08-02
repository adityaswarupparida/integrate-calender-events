import { Eventboard } from "./Eventboard";
import { Navbar } from "./Navbar";

export const Home = () => {
    return (
        <div className="flex flex-col h-screen bg-gradient-to-bl from-cyan-200 via-cyan-50 to-cyan-300">
            <Navbar />
            <Eventboard />       
        </div>
    );
}