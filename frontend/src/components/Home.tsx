import { Eventboard } from "./Eventboard";
import { Navbar } from "./Navbar";

export const Home = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <Eventboard />       
        </div>
    );
}