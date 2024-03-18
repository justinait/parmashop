import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CheckScroll = ({ pageNumber }) => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(pageNumber);

    useEffect(() => {
        window.scrollTo(100, 0);
    }, [location, currentPage]);

    useEffect(() => {
        setCurrentPage(pageNumber);
    }, [pageNumber]);

    return null;
}

export default CheckScroll;
