'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/shared/ui/base/pagination';
import { useEffect, useState } from 'react';

interface PaginationProps {
  page: number;
  size: number;
  total: number;
  onChange: (params: { page: number; size: number }) => void;
}

export const BasePagination = ({
  page,
  size,
  total,
  onChange
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page || 0);
  const [pageSize, setPageSize] = useState(size || 10);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    onChange({ page: currentPage, size: pageSize });
  }, [currentPage, pageSize]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='#' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='#' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
