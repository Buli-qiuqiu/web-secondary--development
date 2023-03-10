// import { useEffect } from 'react';

const useScript = (url1, url2, url3, url4, url5, url6) => {
  // 顺序引入两个外部js文件
  // useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = url1;
    script1.async = false;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = url2;
    script2.async = false;
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = url3;
    script3.async = false;
    document.body.appendChild(script3);
    
    const script4 = document.createElement('script');
    script4.src = url4;
    script4.async = false;
    document.body.appendChild(script4);

    const script5 = document.createElement('script');
    script5.src = url5;
    script5.async = false;
    document.body.appendChild(script5);

    const script6 = document.createElement('script');
    script6.src = url6;
    script6.id = "videonode";
    script6.async = false;
    document.body.appendChild(script6);
    return () => {
      document.body.removeChild(script6);
      document.body.removeChild(script5);
      document.body.removeChild(script4);
      document.body.removeChild(script3);
      document.body.removeChild(script2);
      document.body.removeChild(script1);
    };
  // }, [url1, url2, url3, url4, url5, url6]);
};

export default useScript;
