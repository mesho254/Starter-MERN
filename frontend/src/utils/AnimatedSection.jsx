import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: false, // This makes sure the animation triggers every time the element is in view
    threshold: 0.1, // Trigger animation when 10% of the element is in view
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 100 }
      }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: '100px' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
