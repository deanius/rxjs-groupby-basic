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

agent.on('movie/click', ({ event: { payload: { movieId } } }) => {
  setButtonEmoji(movieId);
  return toggleStatus(movieId);
},  {type: 'movie/update'});

agent.filter('movie/update', ({ event: { payload: data } }) => {
  addToOutput(`Movie ${data.movieId}; event: ${data.event}, state: ${data.status}`);
});

agent.subscribe(dispatcher, 'movie/click');

