import React, { useEffect, useState } from 'react';

const useAsync = (asyncMethod, deps = [], ...params) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await asyncMethod(...params);
      if (fetchedData) {
        setData(fetchedData);
      }
    };
    fetchData();
  }, deps);

  return [data, setData];
};

export default useAsync;
