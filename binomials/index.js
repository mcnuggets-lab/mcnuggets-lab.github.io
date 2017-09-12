//import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';



class App extends React.Component {
    
    constructor() {
        super();
        
        // JSXGraph configs
        JXG.Options.text.useMathJax = true;
        
        var brd = null;
        var firstDrawn = false;
          
        this.state = {
            brd: brd,
            firstDrawn: firstDrawn,
            n: 4,
            p: 0.50
        };
        
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            n: Number(this.refs.nValue.value),
            p: Number(this.refs.pValue.value / 100)
        });
    }
    
    componentDidMount() {
        if (!this.state.brd) {
            // if board is not initialized, then initialize it
            this.setState({
                brd: JXG.JSXGraph.initBoard('box1', {
                    axis: true, 
                    boundingbox: [-5, 5, 5, -5],
                    showNavigation: false,
                    showCopyright: false
                }) 
            });           
        }  
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }
    
    componentDidUpdate() {
        // drawings occur here
        if (!this.state.firstDrawn) {
            var slider1 = this.state.brd.create('slider',[[0.5,-3],[3.5,-3],[-3,1,3]], { name:"c", snapWidth: 0.1 });
            var f = this.state.brd.create('functiongraph', [(x) => (x*x+this.state.n / 4), -10, 10], {strokeWidth:1});
            this.setState({
                firstDrawn: true
            });
        }
        this.state.brd.update();
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
                        <col style={{width:"25%"}} />
                        <col style={{width:"25%"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td><input type="range" min="1" max="12" ref="nValue" value={this.state.n} style={{width:"90%", display: "inline"}} onChange={this.handleChange} /></td>
                            <td>{disp1_text}</td>
                            <td>{disp3_text}</td>
                        </tr>
                        <tr>
                            <td><input type="range" min="0" max="100" ref="pValue" value={this.state.p * 100} style={{width:"90%", display: "inline"}} onChange={this.handleChange} /></td>
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




