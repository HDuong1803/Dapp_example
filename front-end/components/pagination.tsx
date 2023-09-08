import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from "@ajna/pagination";
import { Center } from "@chakra-ui/react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
const PaginationComponent = ({
  pagination,
}: {
  pagination: ReturnType<typeof usePagination>;
}) => {
  const { currentPage, setCurrentPage, pagesCount, pages } = pagination;
  return (
    <Center mt={"10"}>
      {pagesCount > 1 && (
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        >
          <PaginationContainer gap={2}>
            {currentPage > 1 && (
              <PaginationPrevious>
                <GrFormPrevious />
              </PaginationPrevious>
            )}
            <PaginationPageGroup
              separator={<PaginationSeparator bg="white" />}
              gap={1}
            >
              {pages.map((page: number) => (
                <PaginationPage
                  _hover={{
                    bg: "#fcae00",
                  }}
                  w={["30px"]}
                  bg={page === currentPage ? "#fcae00" : "white"}
                  key={`pagination_page_${page}`}
                  page={page}
                  _current={{
                    bg: "#fcae00",
                    color: "white",
                  }}
                />
              ))}
            </PaginationPageGroup>
            {currentPage < pagesCount && (
              <PaginationNext>
                <GrFormNext />
              </PaginationNext>
            )}
          </PaginationContainer>
        </Pagination>
      )}
    </Center>
  );
};

export default PaginationComponent;
