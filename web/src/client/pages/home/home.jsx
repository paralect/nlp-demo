import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as fromAnalyze from 'resources/analyze/analyze.selectors';
import * as analyzeActions from 'resources/analyze/analyze.actions';
import FileDropzone from 'components/file-dropzone';
import TextArea from 'components/text-area';
import Button from 'components/button';
import { FaSpinner } from 'react-icons/fa';
import Table from 'components/table';
import Tabs from 'components/tabs';
import { getFileByUrl } from 'helpers/helpers';
import defaultImg from 'static/images/car-template.jpg';
import defaultText from 'static/default-text.json';

import styles from './home.styles';

const tabs = [{
  name: 'Entities',
  type: 'entities',
}, {
  name: 'Keywords',
  type: 'keywords',
}, {
  name: 'Concepts',
  type: 'concepts',
}, {
  name: 'Categories',
  type: 'categories',
}, {
  name: 'Emotion',
  type: 'emotion',
}];

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.defaultTab = 'entities';
    this.state = {
      file: null,
      text: '',
      isLoading: false,
      currentTab: this.defaultTab,
    };
  }

  async componentDidMount() {
    const file = await getFileByUrl(defaultImg);
    this.setState({ file, text: defaultText });
  }

  onTextChange = (text) => {
    this.setState({ text });
  }

  onFileChange = (file) => {
    this.setState({ file });
  }

  onAnalyze = async () => {
    const { file, text, isLoading } = this.state;
    const { analyzeData } = this.props;

    if (isLoading) {
      return;
    }

    this.setState({ isLoading: true });
    try {
      await analyzeData({ text, image: file });
    } finally {
      this.setState({ isLoading: false, currentTab: this.defaultTab });
    }
  }

  getTableData = () => {
    const { data } = this.props;
    const { currentTab } = this.state;

    const tableData = data[currentTab];

    if (currentTab === 'emotion') {
      return Object.keys(tableData.document.emotion).map((key) => ({
        text: key,
        confidence: tableData.document.emotion[key],
      })).sort((a, b) => Math.sign(b.confidence - a.confidence));
    }

    if (currentTab === 'entities') {
      return [
        ...tableData,
        {
          type: 'Sentiment',
          confidence: data.sentiment.document.score,
          text: data.sentiment.document.label,
        },
      ];
    }

    return tableData;
  }

  getTableColumns = () => {
    const { currentTab } = this.state;

    switch (currentTab) {
      case 'keywords':
        return [{
          Header: 'Keyword',
          accessor: 'text',
        }, {
          Header: 'Relevance',
          accessor: 'relevance',
        }];

      case 'concepts':
        return [{
          Header: 'Concept',
          accessor: 'text',
          Cell: ({ row, value }) => (
            <a rel="noopener noreferrer" target="_blank" href={row.original.dbpedia_resource}>{value}</a>
          ),
        }, {
          Header: 'Score',
          accessor: 'relevance',
        }];

      case 'categories':
        return [{
          Header: 'Hierarchy',
          accessor: 'label',
        }, {
          Header: 'Score',
          accessor: 'score',
        }];

      case 'emotion':
        return [{
          Header: 'Emotion',
          accessor: 'text',
        }, {
          Header: 'Confidence',
          accessor: 'confidence',
        }];

      case 'entities':
      default:
        return [{
          Header: 'Type',
          accessor: 'type',
        }, {
          Header: 'Name',
          accessor: 'text',
          Cell: ({ value, row }) => {
            return row.values.type === 'Color' ? (
              <div className={styles.colorCell}>
                <div className={styles.colorPreview} style={{ background: value }} />
                {value}
              </div>
            ) : value;
          },
        }, {
          Header: 'Confidence',
          accessor: 'confidence',
          Cell: ({ value }) => Math.round(value * 1000) / 1000,
        }];
    }
  }

  onTabSelect = (tab) => {
    this.setState({ currentTab: tab.type });
  }

  render() {
    const { data, textErrors } = this.props;
    const {
      text, file, isLoading, currentTab,
    } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.inputBox}>
          <FileDropzone file={file} onChange={this.onFileChange} />
          <TextArea
            value={text}
            onChange={this.onTextChange}
            title="Textarea"
            errors={textErrors}
          />
          <div className={styles.buttonContainer}>
            <Button
              disabled={isLoading || !text || !file}
              className={styles.analyzeButton}
              onClick={this.onAnalyze}
            >
              {!isLoading && 'Analyze'}
              {isLoading && (<FaSpinner size={24} className={styles.spinner} />)}
            </Button>
          </div>
        </div>
        {data && (
          <div className={styles.tableContainer}>
            <Tabs currentTab={currentTab} tabs={tabs} onSelect={this.onTabSelect} />
            <Table data={this.getTableData()} columns={this.getTableColumns()} />
          </div>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  analyzeData: PropTypes.func.isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  textErrors: PropTypes.arrayOf(PropTypes.any).isRequired,
};

Home.defaultProps = {
  data: null,
};

export default connect((state) => ({
  data: fromAnalyze.analyzeData(state),
  textErrors: fromAnalyze.getTextErrors(state),
}), { analyzeData: analyzeActions.analyzeData })(Home);
