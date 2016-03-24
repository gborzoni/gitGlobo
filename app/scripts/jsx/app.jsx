'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const CommitsView = React.createClass({

	getInitialState() {
  	return {
  		loading: true,
  		error: null,
  		cmits: null,
  		avatar:null
  	}
	},
	
	componentDidMount() {
		console.log('MONTOU ' + this.props.projeto);
  	this.props.commits.then(
  		value => this.setState({loading: false, cmits: value}),
  		error => this.setState({loading: false, error: error})
		);
	},
	
	render() {
		if(this.state.cmits == null){
			return <div className="loader">Carregando...</div>;
		} else {
			return (
				<div>
					<div className="repoInfo">
						<h2>
							{ this.props.projeto }
						</h2>
						<div className="repoInfo--stars">
							<i className="icon-star"></i>
							{ this.props.stars }
						</div>
						<div className="repoInfo--forks">
							<i className="icon-fork"></i>
							{ this.props.forks }
						</div> 
					</div>
					{ this.state.cmits.map((commit, i) => {
							return (
								<div
									className="commitItem" key={ i }>
									<div
										className="commitItem_author">
										<div 
											className="commitItem_author--avatar">
												<img 
													src= {commit.author && commit.author.avatar_url}/>
										</div>
										<div
											className="commitItem_author--contact">
											{ commit.commit.author.name }
											{ commit.commit.author.email }
										</div>
									</div>
									<div
										className="commitItem_message">
										" { commit.commit.message } "
										</div>
								</div>
							);
    				})
					}
					
				</div>
			)
		}
	}

});

const Repositories = React.createClass({
  
  getInitialState() {
    return {
	  	loading: true,
      error: null,
      repos: null,
	  	projeto: null
    }
  },

  componentDidMount() {
    this.props.gitJSON.then(
      value => this.setState({loading: false, repos: value}),
      error => this.setState({loading: false, error: error}));
  },

  _handleClick(repo) {
		console.log('You clicked: ' + repo.name);
		ReactDOM.unmountComponentAtNode(document.getElementById('commits'));
		ReactDOM.render(
			<CommitsView
				commits={ $.getJSON('https://api.github.com/repos/' + repo.full_name + '/commits') }
				projeto={ repo.name } 
				stars={ repo.stargazers_count } 
				forks={ repo.forks_count }/>, 

			document.getElementById('commits')
		);
	},

  render() {
		if (this.state.loading) {
    	return <div className="loader">Carregando...</div>;
    } else {
    	if (this.state.repos) {
    		this.state.repos.sort(function(a, b) {
	        return (b.stargazers_count - a.stargazers_count);
	      });
				return (
					<div>
						<h2>Repositorios</h2>						
		  				{ this.state.repos.map((repo, i) => {
									return (
										<div 
											className="repoItem" 
											key={ i }
											onClick={ this._handleClick.bind(this, repo) } >
											<div 
												className="repoItem_name" > 
												{ repo.name }
											</div>
											<div 
												className="repoItem_info" >
												<div 
													className="repoItem_info--star" > 
													<i 
														className="icon-star" > 
													</i>
													{ repo.stargazers_count }
												</div>

												<div 
													className="repoItem_info--fork" > 
													<i 
														className="icon-fork" > 
													</i>
													{ repo.forks_count }
												</div>
											</div>
										</div>
									);
		    				})
		  				}
						</div>
					
		  	);
    	}
		}
  }

});

ReactDOM.render(
  <Repositories gitJSON={ $.getJSON('https://api.github.com/orgs/globocom/repos') } />, document.getElementById('repos')
);





