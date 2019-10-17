import React from 'react';

import Chart from 'chart.js';

import * as string from '../../functions/string';

class FormLocalStorage extends React.Component {

    constructor(props) {
        super(props);

        const contents = FormLocalStorage.getItems();
        const [ values, labels, colors ] = FormLocalStorage.getChartData(contents);

        this.state = {
            contents: contents,
            chartValues: values,
            chartLabels: labels,
            chartColors: colors,
        };

        this.chartRef = React.createRef();

        this.handleDelete = this.handleDelete.bind(this);
    }

    static getItems() {
        const contents = [];
        for (var key in localStorage) {
            if (!key.startsWith('content-')) continue;

            const rawContent = localStorage.getItem(key);
            const content = JSON.parse(rawContent);
            contents.push({
                key: key,
                id: content.id,
                type: content.type,
                title: content.description.title,
                author: content.description.author,
                size: (new TextEncoder().encode(rawContent)).length,
            });
        }

        // Sort by size on disk
        contents.sort((a, b) => new Date(a.size) > new Date(b.size) ? -1 : 1);

        return contents;
    }

    static getChartData(contents) {
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

    handleDelete(event) {
        const key = event.target.dataset.key;
        const index = event.target.dataset.index;

        localStorage.removeItem(key);
        console.log(`Deleted ${key} from localStorage`);

        const newContents = [...this.state.contents.slice(0, index), ...this.state.contents.slice(index + 1)];
        const [ newValues, newLabels, newColors ] = FormLocalStorage.getChartData(newContents);

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
            <div className="Flex">
                <div style={{ height: "10cm", width: "7cm" }}>
                    <canvas ref={this.chartRef} />
                </div>
                <div>
                    <table className="Styled">
                        <tbody>
                            {this.state.contents.map((content, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {content.type === 'book' && <i className="material-icons">menu_book</i>}
                                            {content.type === 'paste' && <i className="material-icons">attachment</i>}
                                            {content.type === 'epub' && <i className="material-icons">cloud_download</i>}
                                        </td>
                                        <td><em>{content.title}</em></td>
                                        <td>{content.author}</td>
                                        <td>{string.humanReadableSize(content.size)}</td>
                                        <td><button className="Clickable" onClick={this.handleDelete} data-key={content.key} data-index={index}><i className="material-icons md-36">delete_forever</i></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
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
        console.log("update with", this.state.chartValues);
        if (this.chart) {
            this.chart.data = this.getGraphData();
            this.chart.update();
            console.log("updated")
        }
    }
}

export default FormLocalStorage;
