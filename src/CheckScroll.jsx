import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CheckScroll = ({ pageNumber }) => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(pageNumber); // Estado para almacenar el número de página

    useEffect(() => {
        window.scrollTo(100, 0);
    }, [location, currentPage]); // Dependencias: location y currentPage

    // Actualiza el estado de currentPage cuando pageNumber cambia
    useEffect(() => {
        setCurrentPage(pageNumber);
    }, [pageNumber]);

    return null;
}

export default CheckScroll;
