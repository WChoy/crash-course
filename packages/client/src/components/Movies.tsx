import * as React from 'react';
import { connect } from 'react-redux';
import IMovie from 'models/Movie';
import IDirector from 'models/Director';
import { loadMovies } from '../actions';
import { IReduxStore } from '../reducers';

interface IMoviesPassedProps {}

interface IMoviesConnectedProps {
  movies?: Array<IMovie>;
  fetching: boolean;
  directors: { [id: string]: IDirector };
}

interface IMoviesDispatchProps {
  loadMovies: () => void;
}

type MoviesProps = IMoviesPassedProps & IMoviesConnectedProps & IMoviesDispatchProps;

class Movies extends React.Component<MoviesProps, undefined> {
  public componentDidMount() {
    const { loadMovies: dispatchLoadMovies } = this.props;

    dispatchLoadMovies();
  }

  public render() {
    const { fetching, movies } = this.props;

    if (fetching || !movies) {
      return <div>Loading...</div>
    };

    return (
      <ul>
        {movies.map(this.renderMovie)}
      </ul>
    );
  }

  private renderMovie = (movie: IMovie) => {
    const { directors } = this.props;
    const director = directors[movie.director];

    return (
      <li key={movie.id}>
        <strong>{movie.name}</strong> - {director.name}
      </li>
    );
  }
}

const mapStateToProps = (
  store: IReduxStore,
  ownProps: IMoviesPassedProps
): IMoviesConnectedProps => {
  const { moviesExplorer: { movies }, entities } = store;

  const moviesToRender = movies.response && movies.response.result ?
    (movies.response.result as Array<string>).map((id) => entities.movies[id]) :
    [];

  return {
    fetching: movies.isFetching,
    movies: moviesToRender,
    directors: entities.directors
  };
}

export default connect(mapStateToProps, {
  loadMovies
})(Movies);
