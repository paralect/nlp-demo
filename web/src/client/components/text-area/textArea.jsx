import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { motion } from 'framer-motion';

import styles from './textArea.styles';


export default class TextArea extends PureComponent {
  onChange = (e) => {
    const { onChange } = this.props;
    onChange(e.target.value);
  };

  errors() {
    const { errors } = this.props;
    if (!errors.length) {
      return null;
    }

    return (
      <div className={styles.errors}>
        {_.uniq(errors).join(', ')}
      </div>
    );
  }

  render() {
    const {
      className, errors, rows, placeholder, title,
    } = this.props;
    const props = _.omit(this.props, ['className', 'errors', 'onChange', 'rows']);

    return (
      <div className={styles.container}>
        {title && (
          <div className={styles.title}>
            {title}
          </div>
        )}
        <motion.textarea
          className={classnames(styles.textArea, className, {
            [styles.error]: errors.length,
          })}
          onChange={this.onChange}
          rows={rows}
          placeholder={placeholder}
          {...props /* eslint-disable-line react/jsx-props-no-spreading */}
          whileTap={{ scale: 0.95 }}
        />

        {this.errors()}
      </div>
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'search', 'email', 'number', 'password', 'url']),
  errors: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  title: PropTypes.string,
};

TextArea.defaultProps = {
  className: '',
  type: 'text',
  errors: [],
  rows: 3,
  placeholder: 'Add your text here',
  title: null,
};
