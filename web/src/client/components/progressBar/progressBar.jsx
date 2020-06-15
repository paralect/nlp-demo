import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { motion } from 'framer-motion';

import styles from './progressBar.styles';

const ProgressBar = ({ fill, className }) => {
  return (
    <div className={cn(styles.container, className)}>
      <motion.div
        className={styles.filler}
        animate={{ width: ['0%', `${fill}%`] }}
        transition={{ duration: 1 }}
        initial={false}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  fill: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ProgressBar.defaultProps = {
  className: '',
};

export default ProgressBar;
