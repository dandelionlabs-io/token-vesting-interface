import React, { useState, useRef, useEffect } from "react";

import "./Timer.scss";

const Timer = ({ className, time }) => {
  const [timerDays, setTImerDays] = useState("00");
  const [timerHours, setTImerHours] = useState("00");
  const [timerMinutes, setTImerMinutes] = useState("00");
  const [timerSeconds, setTImerSeconds] = useState("00");
  const [isTimeUp, setIsTimeUp] = useState(false);
  let interval = useRef();

  const startTimer = () => {
    const countDownDate = Date.UTC(
      time.year,
      time.month,
      time.day,
      time.hour,
      time.minute,
      time.second,
      time.mSecond
    );

    interval = setInterval(() => {
      var now = new Date().getTime();

      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current);
      } else {
        setTImerDays(days.toString().padStart(2, "0"));
        setTImerHours(hours.toString().padStart(2, "0"));
        setTImerMinutes(minutes.toString().padStart(2, "0"));
        setTImerSeconds(seconds.toString().padStart(2, "0"));
      }

      days <= 0 &&
        hours <= 0 &&
        minutes <= 0 &&
        seconds <= 0 &&
        setIsTimeUp(true);
    }, 1000);
  };

  useEffect(() => {
    startTimer();
  }, []);

  return (
    !isTimeUp && (
      <font className={className}>
        {timerDays} : {timerHours} : {timerMinutes} : {timerSeconds}
      </font>
    )
  );
};

export default Timer;
