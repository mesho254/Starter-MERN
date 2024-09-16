import React, { useState, useEffect } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons'; 
import { Button } from 'antd';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show or hide the button based on scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Show button after scrolling down 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowUpOutlined />}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '50px',
            right: '30px',
            zIndex: '1000',
            backgroundColor: '#1DBF73',
            borderColor: '#1DBF73',
          }}
        />
      )}
    </div>
  );
};

export default ScrollToTopButton;
