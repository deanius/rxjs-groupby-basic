import { Observable, of, concat } from 'rxjs';
import { delay, startWith } from 'rxjs/operators';
// @ts-ignore
import { after } from 'rx-helper';

let globalButtonState = {
  button1: false,
  button2: false
};

let databaseState = {
  button1: false,
  button2: false
};

export const setButtonEmoji = (movieId: number) => {
  globalButtonState[`button${movieId}`] = !globalButtonState[`button${movieId}`];
  let buttonEl = document.querySelector(`#movie${movieId}`);
  buttonEl.innerHTML = globalButtonState[`button${movieId}`] ? '😃' : '😩';
};

export const addToOutput = (text: string) => {
  var node = document.createElement('LI');
  var textnode = document.createTextNode(text);
  node.appendChild(textnode);
  document.getElementById('output').appendChild(node);
};

export const clearOutput = () => {
  let list = document.getElementById('output');
  list.innerHTML = '';
};

export interface Movie {
  movieId: number;
  status?: boolean;
  event?: string;
}

export const toggleStatus = (movieId: number): Observable<Movie> => {
  const button = `button${movieId}`;
  const randomDelay = Math.floor(Math.random() * 2000);

  databaseState[button] = !databaseState[button];

  // @ts-ignore
  return concat(
    after(0, { movieId, status: databaseState[button], event: 'setLocalState' }),
    after(randomDelay, { movieId, status: databaseState[button], event: 'dbReply' }),
  );
};
