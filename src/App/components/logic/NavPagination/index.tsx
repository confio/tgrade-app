import * as React from "react";
import { StyledPagination } from "./style";

export const pageSize = 4;

interface NavPaginationProps {
  readonly currentPage: number;
  readonly setCurrentPage: (currentPage: number) => void;
  readonly total: number;
}

export default function NavPagination({
  currentPage,
  setCurrentPage,
  total,
}: NavPaginationProps): JSX.Element {
  return (
    <StyledPagination
      simple
      hideOnSinglePage
      pageSize={pageSize}
      current={currentPage}
      onChange={setCurrentPage}
      total={total}
    />
  );
}
