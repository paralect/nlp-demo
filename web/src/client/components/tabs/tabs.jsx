import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './tabs.styles';

export default class Tabs extends PureComponent {
  onTabClick = (tab) => () => {
    const { onSelect } = this.props;

    return onSelect(tab);
  }

  render() {
    const {
      tabs, currentTab,
    } = this.props;

    return (
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            className={classnames(styles.tab, { [styles.tabActive]: currentTab === tab.type })}
            onClick={this.onTabClick(tab)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    );
  }
}

Tabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func.isRequired,
};

Tabs.defaultProps = {
  tabs: [],
};
