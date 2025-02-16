// app/components/Pagination.jsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Pagination = ({ currentPage, totalPages, basePath }) => {
  const searchParams = useSearchParams();

  // Build the link using all current query parameters, updating the page value.
  const getLink = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    return `${basePath}?${params.toString()}`;
  };

  // Create an array of page numbers (you can customize this as needed)
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      {currentPage > 1 && (
        <Link href={getLink(currentPage - 1)}>
          <button>Previous</button>
        </Link>
      )}
      {getPageNumbers().map((page) => (
        <Link key={page} href={getLink(page)}>
          <button
            style={{
              fontWeight: currentPage === page ? "bold" : "normal",
              backgroundColor: currentPage === page ? "#0070f3" : "transparent",
              color: currentPage === page ? "white" : "black",
              border: "1px solid #0070f3",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={getLink(currentPage + 1)}>
          <button>Next</button>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
