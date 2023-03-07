import { addMinutes, addDays, parseISO } from 'date-fns'

export type GetTodaysDate = (date: Date) => string;


// // Run myfunc every second
const myfunc = setInterval(() => {
    const createdAt = new Date("2023-02-06T21:54:30.814Z")
    console.log(createdAt);
    const add = addMinutes(createdAt, 1)
    const countDownDate = new Date(add).getTime();
    const now = new Date().getTime();
    
    const timeleft = countDownDate - now;
        
    // Calculating the days, hours, minutes and seconds left
    // const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        
     console.log(`${hours}h:${minutes}m:${seconds}s`);
        
    // Display the message when countdown is over
    if (timeleft < 0) {
        clearInterval(myfunc);
        console.log("TIME UP!!");
    }
    }, 1000);

