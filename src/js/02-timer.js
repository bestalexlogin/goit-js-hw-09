import flatpickr from 'flatpickr';
require('flatpickr/dist/themes/dark.css');
import Notiflix from 'notiflix';

const refs = {
  calendar: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.setAttribute('disabled', 'disabled');

const timer = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    let tarrgetDate = selectedDates[0].getTime();

    localStorage.setItem('tarrgetDate', JSON.stringify(tarrgetDate));

    if (tarrgetDate < Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.startBtn.setAttribute('disabled', 'disabled');
      return;
    }

    refs.startBtn.removeAttribute('disabled', 'disabled');
    refs.startBtn.addEventListener('click', onStart);
  },

  onOpen() {
    localStorage.removeItem('tarrgetDate');
  },
};

flatpickr(refs.calendar, timer);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function editInterfase({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  refs.calendar.setAttribute('disabled', 'disabled');
  const tarrgetDate = Number(localStorage.getItem('tarrgetDate'));
  refs.startBtn.setAttribute('disabled', 'disabled');

  const intervalId = setInterval(() => {
    const isEnd = tarrgetDate <= Date.now();
    if (isEnd) {
      clearInterval(intervalId);
      Notiflix.Notify.success('Time is over!');
      refs.calendar.removeAttribute('disabled', 'disabled');
      return;
    }

    const ms = tarrgetDate - Date.now();
    const time = convertMs(ms);
    editInterfase(time);
  }, 1000);
}