import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import GridLoader from 'react-spinners/GridLoader';

import * as fromAnalyze from 'resources/analyze/analyze.selectors';
import * as analyzeActions from 'resources/analyze/analyze.actions';

import FileDropzone from 'components/file-dropzone';
import TextArea from 'components/text-area';
import Button from 'components/button';
import Table from 'components/table';
import Tabs from 'components/tabs';
import ProgressBar from 'components/progressBar';

import { getFileByUrl } from 'helpers/helpers';
import { EMOTIONS_EMOJIS, TEXT_LIMITS } from 'helpers/constants';

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
  name: 'Emotions',
  type: 'emotions',
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
      textLimitError: null,
    };
  }

  async componentDidMount() {
    const file = await getFileByUrl(defaultImg);
    this.setState({ file, text: defaultText });
  }

  onTextChange = (text) => {
    this.setState({ text, textLimitError: null });

    if (text.length < TEXT_LIMITS.minCharacters) {
      this.setState({ textLimitError: `Text should be longer than ${TEXT_LIMITS.minCharacters} characters` });
    }
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

    if (currentTab === 'emotions') {
      return tableData.map((confidence, index) => ({
        text: EMOTIONS_EMOJIS[index],
        confidence: confidence.toFixed(6),
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

  getProgressBar = ({ value }) => (
    <>
      <ProgressBar className={styles.progressBar} fill={`${Math.abs(value) * 100}`} />
      <span>{Number(value).toFixed(4)}</span>
    </>
  );

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
          Cell: this.getProgressBar,
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
          Cell: this.getProgressBar,
        }];

      case 'categories':
        return [{
          Header: 'Hierarchy',
          accessor: 'label',
        }, {
          Header: 'Score',
          accessor: 'score',
          Cell: this.getProgressBar,
        }];

      case 'emotions':
        return [{
          Header: 'Emotion',
          accessor: 'text',
        }, {
          Header: 'Confidence',
          accessor: 'confidence',
          Cell: this.getProgressBar,
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
          Cell: this.getProgressBar,
        }];
    }
  }

  onTabSelect = (tab) => {
    this.setState({ currentTab: tab.type });
  }

  render() {
    const { data, textErrors } = this.props;
    const {
      text, file, isLoading, currentTab, textLimitError,
    } = this.state;

    const allTextErrors = textLimitError ? textErrors.concat(textLimitError) : textErrors;

    return (
      <div className={cn(styles.page)}>
        <div className={styles.loader}>
          <GridLoader
            size={50}
            margin={40}
            color="#7007babd"
            loading={isLoading}
          />
        </div>
        <div className={cn(styles.inputBox, isLoading && styles.whileLoading)}>
          <div className={styles.preview}>
            <div>
              <div className={styles.previewImageTitle}>Image</div>
              <FileDropzone file={file} onChange={this.onFileChange} />
            </div>
            <TextArea
              value={text}
              onChange={this.onTextChange}
              title="Description"
              errors={allTextErrors}
              className={cn(styles.previewBox, styles.previewText)}
            />
          </div>

          <div className={styles.buttonContainer}>
            <Button
              disabled={isLoading || !text || !file || textLimitError}
              className={styles.analyzeButton}
              onClick={this.onAnalyze}
            >
              {!isLoading && 'Analyze This'}
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
