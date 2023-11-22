import React, { FC, useState, ReactNode, memo } from 'react';

interface DataTableProps {
  data: {}[];
  hasPagination?: boolean;
  changePagination?: (pagination: {
    perPage: number,
    page: number,
    startPage: number,
    totalPage: number,
  }) => void,
  thead: ReactNode,
  tbody: ReactNode,
}

const DataTable: FC<DataTableProps> = ({ data, hasPagination = true, changePagination, thead, tbody }) => {
  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1,
    startPage: 1,
    totalPage: 0,
  });

  const goToPage = (page: string | number) => {
    let newPagination = pagination;

    switch (page) {
      case "prev":
        if (pagination.page > 1) {
          newPagination = {
            ...pagination,
            page: pagination.page - 1,
            startPage: Math.min(pagination.startPage, pagination.page - 1),
          }
        }
        break;

      case "next":
        if (pagination.page < pagination.totalPage) {
          newPagination = {
            ...pagination,
            page: pagination.page + 1,
            startPage: Math.max(
              pagination.startPage,
              pagination.page - 3
            ),
          };
        }
        break;

      default:
        newPagination = {
          ...pagination,
          page: page as number,
        };
        break;
    }

    setPagination(newPagination)
    if (changePagination) {
      changePagination(newPagination);
    }
  };

  React.useEffect(() => {
    setPagination((p) => ({
      ...p,
      totalPage: Math.ceil(data.length / p.perPage),
    }));
  }, [data]);

  return (
    <div className="dataTables_wrapper">
      {hasPagination && (
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length">
              <label>
                Show
                <select
                  value={pagination.perPage}
                  onChange={(e) => {
                    let changedPagination = {
                      ...pagination,
                      page: 1,
                      perPage: Number(e.target.value),
                      totalPage: Math.ceil(data.length / Number(e.target.value)),
                    };

                    setPagination(changedPagination);
                    if (changePagination) {
                      changePagination(changedPagination);
                    }
                  }
                  }
                  className="custom-select custom-select-sm form-control form-control-sm mr-1 ml-1"
                >
                  <option value={10}>
                    10
                  </option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                entries
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-sm-12">
          <table className="table table-hover table-striped table-bordered">
            <thead>
              {thead}
            </thead>
            <tbody>
              {tbody}
            </tbody>
          </table>
        </div>
      </div>

      {hasPagination && (
        <div className="row">
          <div className="col-sm-12 col-md-5">
            <div className="dataTables_info">
              Showing{" "}
              {(pagination.page - 1) * pagination.perPage + 1} to{" "}
              {Math.min(
                pagination.page * pagination.perPage,
                data.length
              )}{" "}
              of {data.length} entries
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <div className="dataTables_paginate paging_simple_numbers">
              <ul className="pagination">
                <li
                  className={`paginate_button page-item previous ${pagination.page === 1 ? "disabled" : ""
                    }`}
                >
                  <a
                    href="/"
                    tabIndex={0}
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage("prev");
                    }}
                  >
                    Prev
                  </a>
                </li>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const page = pagination.startPage + idx;
                  if (page <= pagination.totalPage) {
                    return (
                      <li
                        key={idx}
                        className={`paginate_button page-item ${pagination.page === page ? "active" : ""
                          }`}
                      >
                        <a
                          href="/"
                          tabIndex={0}
                          className="page-link"
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(page);
                          }}
                        >
                          {page}
                        </a>
                      </li>
                    );
                  }
                  return null;
                })}
                <li
                  className={`paginate_button page-item next ${pagination.page === pagination.totalPage ? "disabled" : ""
                    }`}
                >
                  <a
                    href="/"
                    tabIndex={0}
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage("next");
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default memo(DataTable);