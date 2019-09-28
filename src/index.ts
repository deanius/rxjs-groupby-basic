import { Observable, fromEvent, Subject } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';
import { setButtonEmoji, clearOutput, addToOutput, Movie, toggleStatus } from './helpers';
import { agent } from 'rx-helper';

document.querySelector('#clear-output').addEventListener('click', clearOutput);

const button1 = document.querySelector('#movie1');
const button2 = document.querySelector('#movie2');

const movie1$: Observable<Event> = fromEvent(button1, 'click');
movie1$.subscribe(() => dispatcher.next({ movieId: 1 }));

const movie2$: Observable<Event> = fromEvent(button2, 'click');
movie2$.subscribe(() => dispatcher.next({ movieId: 2 }));

const dispatcher = new Subject<Movie>();

const actions$ = dispatcher.asObservable().pipe(
  tap(({ movieId }) => setButtonEmoji(movieId)),
  mergeMap(movie => toggleStatus(movie.movieId))
);

actions$.subscribe((data: Movie) => {
  addToOutput(`Movie ${data.movieId}; event: ${data.event}, state: ${data.status}`);
});
