import React, { useState } from "react";

const useLang = () => {
  const [counterLang, setCounterLang] = useState(1);
  const [language2, setLanguage2] = useState(false);
  const [language3, setLanguage3] = useState(false);
  const [language4, setLanguage4] = useState(false);

  const showLang = () => {
    if (counterLang == 2) {
      setLanguage2(true);
    } else if (counterLang == 3) {
      setLanguage3(true);
    } else if (counterLang == 4) {
      setLanguage4(true);
    }
  };

  const addCounter = () => {
    setCounterLang(counterLang + 1);
  };

  const close = (langNumb: number) => {
    if (langNumb == 2) {
      setCounterLang(counterLang - 1);
      setLanguage2(false);
    } else if (langNumb == 3) {
      setCounterLang(counterLang - 1);
      setLanguage3(false);
    } else if (langNumb == 4) {
      setCounterLang(counterLang - 1);
      setLanguage4(false);
    }
  };

  return {
    counterLang,
    language2,
    language3,
    language4,
    showLang,
    addCounter,
    close,
  };
};

export default useLang;
