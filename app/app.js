
import React from 'react';
import ReactDOM from 'react-dom';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import wrestlerList from './wrestlerlist.js';


var Header = React.createClass({
  render : function(){
    return (<div className="header">
    <h2>Can you smell what the riq <small>(index)</small> is cooking?</h2>
      <h1>ASTROPHYSICS AUTHOR SMACKDOWN</h1>
      <span><a href="#qa">what</a></span>
      </div>)
  }
});

var Footer = React.createClass({
  render : function(){
    return (
      <footer>
      <h3 id = "qa"> what </h3>
      <hr></hr>
      <ul>
          <li>
          <div>
              <b>Q: WOW! What is this?</b>
            </div>
            <div>
              A: This tool allows you to compare the riq index of two people
              in the ADS.
            </div>
            </li>
          <li>
            <div>
              <b>Q: COOL! What is the riq index?</b>
            </div>
            <div>
              A: It is an index developed specifically in order to compare the research output of two different
              authors, normalizing for length of career and number of authors per paper.
            </div>
          </li>
          <li>
            <div>
              <b>Q: AWESOME! But what about author name disambiguation? Is this implementation really fair?</b>
            </div>
            <div>
              A: *Shrugs, then puts you in a headlock*
            </div>
          </li>
          <li>
            <div>
              <b>Q: OK! Where can I learn more about the riq index?</b>
            </div>
            <div>
              A: <a href="https://ui.adsabs.harvard.edu/#abs/2012PLoSO...746428P/abstract">Here</a>
            </div>
          </li>
      </ul>
      </footer>
    )
  }
})

var ErrorView = React.createClass({

  propTypes : {
    restart : React.PropTypes.func
  },

  render : function() {
    return (
      <div>
          <h2> Someone made a mistake!</h2>
          <h2>We're gonna go ahead and blame it on YOU!! </h2>
        <div>
          <img src="https://media.giphy.com/media/l41lO8vRXzSB0CkqQ/giphy.gif" alt="angry umpire dude "/>
        </div>
        <br/>
        <div>
          <button onClick={this.props.restart} className="button-xlarge pure-button bottom-button"> try again</button>
        </div>
      </div>
    )
}

});

  var FormView = React.createClass({

    mixins: [LinkedStateMixin],

    propTypes : {
      postData : React.PropTypes.func,
      img1: React.PropTypes.object,
      img2 : React.PropTypes.object
    },

    getInitialState : function(){
        return {
          query1 : undefined,
          query1 : undefined
        }
    },

    render : function(){

      var label1Name = this.state.query1 ? this.state.query1  : "Astrophysicist #1";
      var label2Name = this.state.query2 ? this.state.query2 : "Astrophysicist #2";
      var buttonText = this.props.loading ? "loading..." : "let the games begin";

      return (
        <div>
          <form className="pure-form">
          <div>
          <div className="col-1">
              <label htmlFor="author1"><h3>{label1Name}</h3></label>
              <div className="img-container">
                <img src={this.props.img1.challenger}></img>
              </div>
              <input id="author1"  valueLink={this.linkState('query1')} placeholder="last, first middle initial"></input>
          </div>
          <div className="col-2">
              <label htmlFor="author2"><h3>{label2Name}</h3></label>
              <div className="img-container">
                <img src={this.props.img2.challenger}></img>
              </div>
              <input id="author2"  valueLink={this.linkState('query2')} placeholder="last, first middle initial"></input>
          </div>
          </div>
          <div>
              <button type="submit" className="button-xlarge pure-button bottom-button" onClick={this.submitForm}>{buttonText}</button>
          </div>
            </form>
         </div>
       )
    },

    submitForm : function(e){
      e.preventDefault();
      this.props.postData(this.state);
    }

  });

  var ResultsView = React.createClass({

    propTypes : {
      data : React.PropTypes.object,
      restart : React.PropTypes.func,
      img1: React.PropTypes.object,
      img2 : React.PropTypes.object
    },

    render : function() {

      var winner = this.props.data.author1.riq > this.props.data.author2.riq ? "author1" : "author2";
      var winnerName = this.props.data[winner].name;
      var img1 = (winner == "author1") ? this.props.img1.winner : this.props.img1.loser;
      var img2 = (winner == "author2") ? this.props.img2.winner : this.props.img2.loser;

      return (
        <div className="results-view">
          <div className="col-1">
          <h3>{this.props.data.author1.name}</h3>
          <div className="img-container">
            <img src={img1}></img>
          </div>
          <div className="smackdown-result">
            <b>RIQ:</b> {this.props.data.author1.riq}
          </div>
          </div>
          <div className="col-2">
          <h3>{this.props.data.author2.name}</h3>
          <div className="img-container">
            <img src={img2}></img>
          </div>
          <div className="smackdown-result">
            <b>RIQ:</b> {this.props.data.author2.riq}
          </div>
        </div>
        <div>
        <span className="announcement"> COWABUNGA!!!! What a win by <b>{winnerName}</b>!!! </span>
        </div>
        <div>
          <button className="button-xlarge pure-button bottom-button" onClick={this.props.restart}> start another match</button>
        </div>
      </div>
    )
  },
  });



  var ContainerView = React.createClass({


    getRandomImages : function(){

      //get some image sets
      var imageList =  wrestlerList.slice();

      var img1Index = parseInt(Math.random() * (imageList.length));
      var img1 = imageList[img1Index];
      imageList.splice(img1Index, 1);
      var img2 = imageList[parseInt(Math.random() * imageList.length)];

      return [img1,img2];
    },

    getInitialState: function(){

      var images = this.getRandomImages();

      return {
        //can also be "results" or "error"
        view : "form",
        resultData : undefined,
        img1 : images[0],
        img2 : images[1]
      }
    },

    //necessary to have a diff function?
    restart : function(){

      var images = this.getRandomImages();
        this.setState({
          view : "form",
          resultData: undefined,
          img1 : images[0],
          img2 : images[1]
        });
    },

    render: function() {
      var view;

      if (this.state.view === "form"){
        view = (<FormView postData = {this.postData} img1={this.state.img1} img2={this.state.img2}  />);
      }
      else if (this.state.view === "loading"){
        view = (<FormView postData = {this.postData} img1={this.state.img1} img2={this.state.img2} loading={true} />);
      }
      else  if  (this.state.view === "result"){
        view = (<ResultsView data = {this.state.resultData} restart = {this.restart} img1={this.state.img1} img2={this.state.img2} />);
      }
      else if (this.state.view === "error"){
        view = (<ErrorView restart = {this.restart} />);
      }
      return (
        <div>
          <Header/>
            <main>
              {view}
            </main>
          <Footer/>
        </div>
      )
    },

    postData : function(data){

      //show loading view
      this.setState({
        view : "loading"
      });

      //return if failure
      if (!data || !data.query1 || !data.query2){
        console.error("wrong data submitted");
        return
      }

    var that = this;
    //this will be set into state when ajax request returns
    var resultData = {
      author1 : {
        name : data.query1,
        riq : undefined
      },
      author2 : {
        name : data.query2,
        riq : undefined
      }
    };

    that.setState({
      view : "error"
    })

    //ajax request
      // var r = new XMLHttpRequest();
      // r.open("POST", "/smackdown", true);
      //
      // r.onreadystatechange = function () {
      // 	if (r.readyState != 4 || r.status != 200){
      //     that.setState({
      //       view : "error"
      //     })
      //     return
      //   };
      //   var returnedJSON = JSON.parse(r.responseText);
      //
      //   resultData.author1.riq = returnedJSON.author1.riq;
      //   resultData.author2.riq = returnedJSON.author2.riq;
      //
      //   that.setState({
      //     resultData :resultData,
      //     view : "results"
      //   });
      //
      // };
      //
      // r.send();
      //end ajax request


      //for testing
      // resultData.author1.riq = 5;
      // resultData.author2.riq = 7;
      //
      // setTimeout(function(){
      //   that.setState({
      //     resultData : resultData,
      //     view : "result"
      //   });
      // }, 1000);

    }

  });

  ReactDOM.render(
    <ContainerView/> ,
    document.querySelector('.container')
  );
