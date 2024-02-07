import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const CheckScroll = () => {
    
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo(100,0);
    }, [location]);
    
    return (
        <>
            
        </>
    );
}

export default CheckScroll;