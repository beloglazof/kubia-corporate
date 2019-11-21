import React, { useEffect, useState } from 'react';

const useAsync = (asyncMethod, deps = []) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await asyncMethod();
      if (fetchedData) {
        setData(fetchedData);
      }
    };
    fetchData();
  }, deps);

  return data;
};

export default useAsync;
