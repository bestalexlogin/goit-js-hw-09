import Notiflix from 'notiflix';

const form = document.querySelector('.js-form');

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();

  let {
    elements: { delay, step, amount },
  } = evt.currentTarget;

  delay = Number(delay.value);
  amount = Number(amount.value);
  step = Number(step.value);

  for (let i = 1; i <= amount; i++) {
    createPromise(i, delay);
    delay += step;
  }
}

function createPromise(position, delay) {
  setTimeout(() => {
    const shouldResolve = Math.random() > 0.3;

    const promise = new Promise((resolve, reject) => {
      if (shouldResolve) {
        resolve(`✅ Fulfilled promise ${position} in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise ${position} in ${delay}ms`);
      }
    });

    promise
      .then(value => Notiflix.Notify.success(value))
      .catch(error => Notiflix.Notify.failure(error));
  }, delay);
}