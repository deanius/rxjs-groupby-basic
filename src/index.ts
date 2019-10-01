import { Observable, fromEvent, Subject } from 'rxjs';
import { agent } from 'rx-helper';
import { tap, mergeMap } from 'rxjs/operators';
import { setButtonEmoji, clearOutput, addToOutput, Movie, toggleStatus } from './helpers';

document.querySelector('#clear-output').addEventListener('click', clearOutput);

const button1 = document.querySelector('#movie1');
const button2 = document.querySelector('#movie2');

const movie1$: Observable<Event> = fromEvent(button1, 'click');
movie1$.subscribe(() => dispatcher.next({ movieId: 1 }));

const movie2$: Observable<Event> = fromEvent(button2, 'click');
movie2$.subscribe(() => dispatcher.next({ movieId: 2 }));

const dispatcher = new Subject<Movie>();

agent.filter('movie/click', ({ event: { payload: { movieId } } }) => {
  setButtonEmoji(movieId);
  const handlerName = `movieUpdater-${movieId}`;
  if (agent.handlerNames().indexOf(handlerName) === -1) {
    // prettier-ignore
    const sub = agent.on(matchesMovieClickOn(movieId), ({ event: { payload: { movieId }}}) => {
      return toggleStatus(movieId)
    }, { type: 'movie/dbUpdate', concurrency: 'parallel', name: handlerName})
  }
});

function matchesMovieClickOn(movieId) {
  return ({ event: { type, payload } }) => {
    return type === 'movie/click' && movieId === payload.movieId;
  };
}

agent.on('movie/dbUpdate', ({ event: { payload: { movieId, status } } }) => {
  addToOutput(`Rx Helper: Movie ${movieId} complete; state: ${status}`);
});

agent.subscribe(dispatcher, 'movie/click');

// const actions$ = dispatcher.asObservable().pipe(
//   tap(({ movieId }) => setButtonEmoji(movieId)),
//   mergeMap(movie => toggleStatus(movie.movieId))
// );

// actions$.subscribe((data: Movie) => {
//   addToOutput(`Plain mergeMap: Movie ${data.movieId} complete; state: ${data.status}`);
// });
