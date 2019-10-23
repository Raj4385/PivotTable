import React, { Component } from 'react';
import './App.css';
import expand from '../src/images/expand.png';
import collapse from '../src/images/collapse.png';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      firstLevelGroupCollection : null,
      firatLevelGroupRow: null,
      image: expand,
      isExpand: false,
      currentRow: null,
      rowState: []
    };
  }

  componentWillMount()
  {
    var l_data = require('../src/data/data.json');

    let groups = l_data.Pivot1.data.reduce((r, a) => {
      r[a.Strategy] = [...r[a.Strategy] || [], a];
      return r;
    }, {});

    let uniqueValue = [...new Set(l_data.Pivot1.data.map(x => x.Strategy))];

    // let stateLineArray = []
    // uniqueValue.forEach(el => {
    //   let stateLine = {
    //     el: false,
    //   }
    //   stateLineArray.push(stateLine)
    // });

    this.setState({data : l_data, firstLevelGroupCollection: groups, firatLevelGroupRow: uniqueValue});
  }

  // setFilterValue = (filterName) => {
  //   this.setState({ filterObj: {...this.state.filterObj, [filterName]: !this.state.filterObj[filterName] }}, () => {
  //     this.updateDisplayRecords();
  //   });
  // }

  OnExpandOrColapse = (category) => {
    this.setState({rowState: {...this.state.rowState, [category] : !this.state.rowState[category]}});
  }

  render() {
    var data = this.state.data;
    var groups = this.state.firstLevelGroupCollection;
    var uniqueValue = this.state.firatLevelGroupRow;

    var headers = data.Pivot1.headers.map(el => (
      <th>{el.displayName}</th>
    ));


    let GroupedItem = []

    uniqueValue.forEach(el => {
      let lineitem = {
        "category": el,
        "MV": groups[el].reduce((a, b) => a + (b["MV"] || 0), 0),
        "Carry": groups[el].reduce((a, b) => a + (b["Carry"] || 0), 0),
        "NetPL1": groups[el].reduce((a, b) => a + (b["Net PL 1"] || 0), 0),
        "NetPL2": groups[el].reduce((a, b) => a + (b["Net PL 2"] || 0), 0),
        "NetPL3": groups[el].reduce((a, b) => a + (b["Net PL 3"] || 0), 0),
        "IsLineItem" : false,
        "IsHeader": true,
        "IsSubHeader" : false
      }

      GroupedItem.push(lineitem)
      if(this.state.rowState[el])
      {
        
        let innergroups = groups[el].reduce((r, a) => {
          r[a["Sub Strategy"]] = [...r[a["Sub Strategy"]] || [], a];
          return r;
        }, {});

        let inneruniqueValue = [...new Set(groups[el].map(x => x["Sub Strategy"]))];

        inneruniqueValue.forEach(element => {
        let innerlineitem = {
          "category": element,
          "MV":  innergroups[element].reduce((a, b) => a + (b["MV"] || 0), 0),
          "Carry":innergroups[element].reduce((a, b) => a + (b["Carry"] || 0), 0),
          "NetPL1": innergroups[element].reduce((a, b) => a + (b["Net PL 1"] || 0), 0),
          "NetPL2": innergroups[element].reduce((a, b) => a + (b["Net PL 2"] || 0), 0),
          "NetPL3": innergroups[element].reduce((a, b) => a + (b["Net PL 3"] || 0), 0),
          "IsLineItem": false,
          "IsHeader": false,
          "IsSubHeader" : true
        }
        GroupedItem.push(innerlineitem);
if(this.state.rowState[element])
{
        innergroups[element].forEach(ele => {
          let rowline = {
            "category": ele.Security,
            "MV":  ele.MV,
            "Carry":ele.Carry,
            "NetPL1": ele["Net PL 1"],
            "NetPL2": ele["Net PL 2"],
            "NetPL3":ele["Net PL 3"],
            "IsLineItem": true,
            "IsHeader": false,
            "IsSubHeader" : false
          }
          GroupedItem.push(rowline);
        }
        );
      }
      });
      }
    });
console.log(this.state.rowState);
    console.log(groups);
    console.log(uniqueValue);
    console.log(GroupedItem);


    var result = GroupedItem.map(el => (
      <tr>
        <td style={{ textAlign: 'left' }}>{el.IsLineItem ? <div><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;{el.category}</div> : el.IsSubHeader ? <div><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><img src={this.state.rowState[el.category] ? collapse : expand} style={{ width: '16px', height: '16px' }} onClick={() => this.OnExpandOrColapse( el.category)} />&nbsp;{el.category}</div> : <div><img src={this.state.rowState[el.category] ? collapse : expand} style={{ width: '16px', height: '16px' }} onClick={() => this.OnExpandOrColapse( el.category)} />&nbsp;{el.category}</div>}</td>
        <td style={(el.MV > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(el.MV)}</td>
        <td style={(el.Carry > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(el.Carry).toFixed(2)}</td>
        <td style={(el.NetPL1 > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(el.NetPL1).toFixed(2)}</td>
        <td style={(el.NetPL2 > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(el.NetPL2).toFixed(2)}</td>
        <td style={(el.NetPL3 > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(el.NetPL3).toFixed(2)}</td>
      </tr>
    ));

    var grandTotal = <tr style={{ backgroundColor: '#87CEFA' }}>
      <td style={{ textAlign: 'left' }}>Grand Total</td>
      <td style={(GroupedItem.reduce((a, b) => a + (b["MV"] || 0), 0) > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(GroupedItem.reduce((a, b) => a + (b["MV"] || 0), 0)).toFixed(2)}</td>
      <td style={(GroupedItem.reduce((a, b) => a + (b["Carry"] || 0), 0) > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(GroupedItem.reduce((a, b) => a + (b["Carry"] || 0), 0)).toFixed(2)}</td>
      <td style={(GroupedItem.reduce((a, b) => a + (b["NetPL1"] || 0), 0) > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(GroupedItem.reduce((a, b) => a + (b["NetPL1"] || 0), 0)).toFixed(2)}</td>
      <td style={(GroupedItem.reduce((a, b) => a + (b["NetPL2"] || 0), 0) > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(GroupedItem.reduce((a, b) => a + (b["NetPL2"] || 0), 0)).toFixed(2)}</td>
      <td style={(GroupedItem.reduce((a, b) => a + (b["NetPL3"] || 0), 0) > 0) ? { textAlign: 'right' } : {textAlign: 'right', color:'red' }}>{Math.abs(GroupedItem.reduce((a, b) => a + (b["NetPL3"] || 0), 0)).toFixed(2)}</td>
    </tr>

    return (
      <div className="App">
        <table style={{ width: '100%', borderWidth: '1px', borderColor: 'black', borderStyle: 'solid' }}>
          <tr style={{ backgroundColor: '#3F51B5', color: '#FFFFFF' }}>
            <th></th>
            {headers}
          </tr>
          {result}
          {grandTotal}
        </table>
      </div>
    );
  }
}

export default App;
