import { useEffect, useState } from 'react';

const useAsync = (asyncMethod, initialValue, deps = [], ...params) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await asyncMethod(...params);
        if (fetchedData) {
          setData(fetchedData);
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
        console.log(e);
      }
    };

    setLoading(true)
    fetchData();
  }, deps);

  return [data, setData, loading];
};

export default useAsync;
