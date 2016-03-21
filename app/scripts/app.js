var handleClick = function(repo) {
  	console.log('You clicked: ' + repo.name);
	ReactDOM.unmountComponentAtNode(document.getElementById('commits'));
	ReactDOM.render(
  		<CommitsView commits={$.getJSON('https://api.github.com/repos/' + repo.full_name + '/commits')} projeto={repo.name} />, document.getElementById('commits')
	);
	
}

var RepoItemWrapper = new React.createClass({
	render : function(){
		return(
			<li><a onClick={handleClick.bind(this, this.props.repo)} >{this.props.repo.name}</a>{" ( "+ this.props.repo.stargazers_count + " stars / " + this.props.repo.forks_count + " forks)"}</li>
		) 
	}
});
var CommitItemWrapper = new React.createClass({
	render : function(){
		return(
			<li>{this.props.commit.message}</li>
		) 
	}
});


var Title = new React.createClass({
	render : function(){
		return(
			<h2>{this.props.children}</h2>
		) 
	}
});

var CommitsView = new React.createClass({

	getInitialState: function() {
    	return {
	  		loading: true,
      		error: null,
      		cmits: null
    	};
  	},
	
	componentDidMount: function() {
		console.log('MONTOU ' + this.props.projeto);
    	this.props.commits.then(
      		value => this.setState({loading: false, cmits: value}),
      		error => this.setState({loading: false, error: error}));
  	},
	
	render : function (){
		
		if(this.state.cmits == null){
			return (<span>Carregando</span>)	
		}else{
			return (
				<div>
					<Title>Projeto {this.props.projeto}</Title>
					<ul>
						{this.state.cmits.map(function (commit, i) {
							return (
								<CommitItemWrapper commit={commit.commit}/>
							);
        				})}
					</ul>
				</div>
			)
		}
		
	}
});

var Repositories = React.createClass({
  getInitialState: function() {
    return {
	  loading: true,
      error: null,
      repos: null,
	  projeto: null
    };
  },

  componentDidMount: function() {
    this.props.gitJSON.then(
      value => this.setState({loading: false, repos: value}),
      error => this.setState({loading: false, error: error}));
  },

  render: function() {
	
	if (this.state.loading) {
      	return <span>Loading...</span>;
    } else {
		return (
				<div>
					<Title>Repositorios</Title>
					<ul>
        				{this.state.repos.map(function (repo) {
							return (
								<RepoItemWrapper key={repo.id} repo={repo}/>
							);
        				})}
      				</ul>
				</div>
			
    	);
	}
  }
});

ReactDOM.render(
  <Repositories gitJSON={$.getJSON('https://api.github.com/orgs/globocom/repos')} />, document.getElementById('repos')
);