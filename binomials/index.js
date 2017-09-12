//import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';



class App extends React.Component {
    
    constructor() {
        super();
        
        var brd = null;
          
        this.state = {
            brd: brd
        };
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
    }
    
    componentDidUpdate() {
        // drawings occur here
        var slider1 = this.state.brd.create('slider',[[0.5,-3],[3.5,-3],[-3,1,3]], { name:"c", snapWidth: 0.1 });
        var f = this.state.brd.create('functiongraph', [(x) => (x*x+slider1.Value()), -10, 10], {strokeWidth:1});
    }
  
    render() {
        var brd_style = {
            width: 500, 
            height: 500, 
            border: "1px solid black",
            borderRadius: 0
        };
            
        return (
            <div id="box1" className="jxgbox" style={brd_style}></div>
        );
    }
                
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


