import React, { useState } from 'react';
import DataTable from './DataTable';

const App: React.FC = () => {
  let data: { name: string, size: string, price: string, count: number }[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      name: "Apple",
      size: "big",
      price: "$120",
      count: i,
    });
  }

  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1,
    startPage: 1,
    totalPage: 0,
  });

  const changePagination = (pagination: {
    perPage: number,
    page: number,
    startPage: number,
    totalPage: number,
  }) => {
    setPagination(pagination);
  }

  return (
    <DataTable data={data} hasPagination={true} changePagination={changePagination} thead={
      <tr>
        <th>id</th>
        <th>Fruit Name</th>
        <th>Size</th>
        <th>Price / Count</th>
      </tr>
    } tbody={
      data.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage).map((item, i) => (
        <tr key={i}>
          <td>{i + (pagination.page - 1) * pagination.perPage + 1}</td>
          <td>{item.name}</td>
          <td>{item.size}</td>
          <td>
            <span>{item.price}</span> / <span>{item.count}</span>
          </td>
        </tr>
      ))
    } />
  );
};

export default App;