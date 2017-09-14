//import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';



const MAX_N = 12;

class App extends React.Component {
    
    constructor() {
        super();
        
        // JSXGraph configs
        JXG.Options.text.useMathJax = true;
        JXG.Options.axis.ticks = JXG.merge(JXG.Options.axis.ticks, {
            drawLabels: false,
        });
        
        var brd = null;
        var chart = null;
        var checkboxNormal = null;
        var firstDrawn = false;
          
        this.state = {
            brd: brd,
            chart: chart,
            checkboxNormal: checkboxNormal,
            firstDrawn: firstDrawn,
            showNormal: false,
            n: 4,
            p: 0.50
        };
        
        this.handleChange = this.handleChange.bind(this);
        //this.handleCheckbox = this.handleCheckbox.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            n: Number(this.refs.nValue.value),
            p: Number(this.refs.pValue.value / 100)
        });
    }
    
    handleCheckbox(checked) {
        this.setState({
            showNormal: checked
        });
    }
    
    /*handleCheckbox(event) {
        console.log(event.target.checked);
        this.setState({
            showNormal: event.target.checked
        });
    }*/
    
    // board initialization goes here
    componentDidMount() {
        if (!this.state.brd) {
            // if board is not initialized, then initialize it
            this.setState({
                brd: JXG.JSXGraph.initBoard('box1', {
                    axis: false, 
                    grid: false,
                    zoom: { enabled: false },
                    pan: { enabled: false },
                    boundingbox: [-1, 1.1, 12.5, -0.05],
                    keepaspectratio: false,
                    showNavigation: false,
                    showCopyright: false
                }) 
            });           
        }  
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }
    
    // drawings occur here
    componentDidUpdate() {
        var brd = this.state.brd;
        var newbdb = [-1 - (this.state.n + 1.8) / 19, 1.1, this.state.n + 0.8, -0.05];
        
        // data to draw
        var xData = [...Array(MAX_N + 1).keys()]; // x-data to draw
        var yData = xData.map((x) => {
            return (() => binomialProb(this.state.n, this.state.p, x));
        }); // y-data to draw
        if (!this.state.firstDrawn) {
            
            // draw axes, ticks and labels
            var xAxis = brd.create('axis', [[0, 0], [1, 0]], { 
                name: 'x', ticks: { majorHeight: 0, minorHeight: 0 }, withLabel: false, drawZero: true, highlight: false, strokeColor: 'gray', fixed: true 
            });
            var yAxis = brd.create('axis', [[-1, 0], [-1, 1]], { 
                name: 'y', ticks: { majorHeight: 0, minorHeight: 0 }, withLabel: false, highlight: false, strokeColor: 'gray', fixed: true 
            });
            
            var xTicks = brd.create('ticks', [xAxis, xData], { highlight: false, drawLabels: true, label: { offset: [0, -15], highlight: false, anchorX: 'middle' } });
            var yTicks = brd.create('ticks', [yAxis, [...Array(10).keys()].map((x) => 0.1 * (x+1))], 
                { highlight: false, drawLabels: true, label: { offset: [-10, 0], highlight: false, anchorX: 'right' } }); // ticks 0.1, 0.2, etc.
            
            var yLabels = [];
            for (let i = 0; i <= MAX_N; i++) {
                yLabels.push(brd.create('text', [i, () => yData[i]() + 0.015, () => (this.state.n >= i) ? yData[i]().toFixed(4) : ""], {
                    fixed: true, highlight: false, anchorX: "middle"
                }));
            }
            
            // normal curve
            var gaussian = (x) => {
                let mu = this.state.n * this.state.p;
                let sigma_sq = this.state.n * this.state.p * (1 - this.state.p);
                return 1 / Math.sqrt(2 * Math.PI * sigma_sq) * (Math.E ** (-((x-mu)**2) / (2*sigma_sq)));
            }
            var checkboxNormal = brd.create("checkbox", [() => (-1 + 30 / 57 * (this.state.n + 1.8)), 1.06, 
                "show corresponding normal curve"], { highlight: false, fixed: true, fontSize: 16 });
            var f = brd.create("functiongraph", [gaussian, -20, 20], { strokeColor: "red", highlight: false, visible: () => this.state.showNormal });
            JXG.addEvent(checkboxNormal.rendNodeCheckbox, 'change', () => this.handleCheckbox(checkboxNormal.Value()), checkboxNormal);
            
            // draw chart
            var chart = brd.create('chart', [xData, yData], { chartStyle: 'bar', width: 0.7, labels: yData, colors: ['blue'] });
            this.setState({
                firstDrawn: true,
                chart: chart,
                checkboxNormal: checkboxNormal
            });
        }

        // otherwise only update the board
        brd.setBoundingBox(newbdb);
        if (this.state.checkboxNormal) this.state.checkboxNormal.setPosition(JXG.COORDS_BY_USER, [-1 + 30 / 57 * (this.state.n + 1.8), 1.06]);
        brd.update();
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }
    
    render() {
        
        var table_style = {
            width: 640,
            textAlign: "center"
        }
        
        var brd_style = {
            width: 638, 
            height: 638,
            border: "none",
            borderRadius: 0
        };
        
        var slider_style = {
            width: "90%",
            display: "inline"
        }
        
        var n = this.state.n;
        var p = this.state.p;
        
        var disp1_text = "\\(n=" + n + "\\)";
        var disp2_text = "\\(p=" + p.toFixed(2) + "\\)";
        var disp3_text = "\\(E(X)=" + (n * p).toFixed(2) + "\\)";
        var disp4_text = "\\(\\text{Var}(X)=" + (n*p*(1-p)).toFixed(4) + "\\)";
        
        return (
            <div>
                <h1>Binomial Distribution</h1>
                <table border={1} style={table_style}>
                    <colgroup>
                        <col style={{width:"50%"}} />
                        <col style={{width:"20%"}} />
                        <col style={{width:"30%"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td><input type="range" min="1" max={MAX_N} ref="nValue" value={this.state.n} style={slider_style} onChange={this.handleChange} /></td>
                            <td>{disp1_text}</td>
                            <td>{disp3_text}</td>
                        </tr>
                        <tr>
                            <td><input type="range" min="0" max="100" ref="pValue" value={this.state.p * 100} style={slider_style} onChange={this.handleChange} /></td>
                            <td>{disp2_text}</td>
                            <td>{disp4_text}</td>
                        </tr>
                        <tr>            
                            <td colSpan={3}><div id="box1" className="jxgbox" style={brd_style}></div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// =========================================

// helper functions

// Combinatorial functions.
function factorial(n) {
    if (!(Number.isFinite(n) && n % 1 === 0)) throw "Input must be an integer.";
    else if (n === 0) return 1;
    else {
        var res = 1;
        for (let i = 2; i <= n; i++) {
            res *= i;
        }
    }
    return res;
}

function nPr(n, r) {
    if (!(Number.isFinite(n) && n % 1 === 0 && Number.isFinite(r) && r % 1 === 0)) throw "Input must be an integer.";
    if (r > n) return 0;
    if (r === 0) return 1;
    if (r === 1) return n;
    return n * nPr(n - 1, r - 1);
}

function nCr(n, r) {
    if (!(Number.isFinite(n) && n % 1 === 0 && Number.isFinite(r) && r % 1 === 0)) throw "Input must be an integer.";
    else if (r > n) return 0;
    else if (r > n / 2) r = n - r;
    return nPr(n, r) / factorial(r);
}

// Calculate binomial prob. P(X=x) when X ~ B(n,p).
function binomialProb(n, p, x) {
    return nCr(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
}




