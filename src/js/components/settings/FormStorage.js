import React from 'react';

import Chart from 'chart.js';

import { StyledTable } from '../core/UI';
import { Info } from '../toolbox/Text';
import * as string from '../../functions/string';
import * as storage from '../../functions/storage';

import MenuBookIcon from '@material-ui/icons/MenuBook';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

function getChartData(contents) {
    const MB = 1024 * 1024;
    const localStorageCapacity = 10 * MB; // Current value in popular browsers
    const localStorageWarningCapacity = 1 * MB; // Alert when available space becomes critical

    const typeIndices = ["book", "paste", "epub", "misc", "remaining"];
    const indexRemaining = typeIndices.indexOf("remaining");

    const values = [0, 0, 0, 0, 100];
    const labels = ["Books", "Copy/Paste texts", "ePubs", "Others", "Free space"];
    const colorFree = 'rgba(0, 0, 0, 0.1)';
    const colorUsed = 'rgba(0, 0, 0, 0.4)';
    const colorWarning = 'rgba(255, 0, 0, 0.4)';
    const colors = [colorUsed, colorUsed, colorUsed, colorUsed, colorFree];

    // Group items per category
    let totalSize = 0;
    for (let c = 0; c < contents.length; c++) {
        const content = contents[c];
        let index = typeIndices.indexOf(content.type);
        if (index === -1) {
            console.log(`Unsupported content type ${content.type} while rendering localStorage graph.`);
            index = typeIndices.indexOf("misc");
        }
        values[index] += content.size;
        totalSize += content.size;
    }
    values[typeIndices.indexOf("remaining")] = localStorageCapacity - totalSize;

    // Check available space to display a warning
    if (values[indexRemaining] < localStorageWarningCapacity) {
        colors[indexRemaining] = colorWarning;
    }

    // Remove empty categories
    const filteredValues = [];
    const filteredLabels = [];
    const filteredColors = [];
    for (let i = 0; i < typeIndices.length - 1; i++) { // Always add remaining
        if (values[i] > 0) {
            filteredValues.push(values[i]);
            filteredLabels.push(labels[i]);
            filteredColors.push(colors[i]);
        }
    }
    // Add available space category
    filteredValues.push(values[indexRemaining]);
    filteredLabels.push(labels[indexRemaining]);
    filteredColors.push(colors[indexRemaining]);

    return [filteredValues, filteredLabels, filteredColors];
}

class FormStorage extends React.Component {

    constructor(props) {
        super(props);

        const contents = storage.getContentsMetadata();
        const [ values, labels, colors ] = getChartData(contents);

        this.state = {
            contents: contents,
            chartValues: values,
            chartLabels: labels,
            chartColors: colors,
        };

        this.chartRef = React.createRef();

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(event) {
        const key = event.target.dataset.key;
        const index = event.target.dataset.index;

        localStorage.removeItem(key);
        console.log(`Deleted ${key} from localStorage`);

        const newContents = [...this.state.contents.slice(0, index), ...this.state.contents.slice(index + 1)];
        const [ newValues, newLabels, newColors ] = getChartData(newContents);

        this.setState(state => ({
            ...state,
            contents: newContents,
            chartValues: newValues,
            chartLabels: newLabels,
            chartColors: newColors,
        }));
    }

    render() {
        return (
            <>
                {this.state.contents.length === 0 && <p><Info>No content in <code>localStorage</code>.</Info></p>}
                <div style={{ height: "10cm", width: "7cm" }}>
                    <canvas ref={this.chartRef} />
                </div>
                {this.state.contents.length > 0 && <div>
                    <StyledTable data-testid="table">
                        <tbody>
                            {this.state.contents.map((content, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {content.type === 'book' && <MenuBookIcon />}
                                            {content.type === 'paste' && <AttachmentIcon />}
                                            {content.type === 'epub' && <CloudDownloadIcon />}
                                        </td>
                                        <td><em>{content.title}</em></td>
                                        <td>{content.author}</td>
                                        <td>{string.humanReadableSize(content.size)}</td>
                                        <td><button className="Clickable" onClick={this.handleDelete} data-key={content.key} data-index={index}><DeleteForeverIcon /></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </StyledTable>
                </div>}
            </>
        );
    }

    getGraphData() {
        return {
            datasets: [{
                data: this.state.chartValues,
                backgroundColor: this.state.chartColors,
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 0, 0.7)'
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: this.state.chartLabels,
        };
    }

    componentDidMount() {
        if (areWeTestingWithJest()) return;
        const ctx = this.chartRef.current.getContext('2d');
        this.chart = new Chart(ctx, {  // eslint-disable-line no-new
            type: 'doughnut',
            data: this.getGraphData(),
            options: {
                borderWidth: 0,
                legend: {
                    position: "bottom",
                    labels: {
                        fontSize: 16,
                        fontColor: "black",
                    }
                },
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }]
                }
            },
        });
    }

    componentDidUpdate() {
        if (this.chart) {
            this.chart.data = this.getGraphData();
            this.chart.update();
        }
    }
}

function areWeTestingWithJest() {
    return process.env.JEST_WORKER_ID !== undefined;
}

export default FormStorage;
