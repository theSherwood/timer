import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";

let beep = () => {
  return new Promise((resolve, reject) => {
    let b = document.getElementById("beep");
    if (b) {
      b.onended = resolve;
      b.play();
    } else {
      reject();
    }
  });
};

let draw_svg = (percentage = 0) => {
  let pie_path = document.getElementById("pie-path");
  var a = 360 * percentage,
    p = Math.PI,
    r = (a * p) / 180,
    x = Math.sin(r) * 125,
    y = Math.cos(r) * -125,
    mid = a > 180 ? 1 : 0,
    anim = "M 0 0 v -125 A 125 125 1 " + mid + " 1 " + x + " " + y + " z";

  pie_path.setAttribute("d", anim);
};

let IntervalLengthButton = (props) => {
  return (
    <button
      class={props.length === props.n ? "selected" : ""}
      onclick={props.set_to(props.n)}
    >
      {props.n}
    </button>
  );
};

const App = () => {
  let [s, set_s] = createStore({
    time: 30,
    timer: null,
    interval_length: 30, //30,
    finished_intervals: 0,
    total_intervals: 5
  });

  createEffect(() => {
    if (s.time < 1) {
      if (s.finished_intervals === s.total_intervals - 1) {
        beep().then(beep).then(beep);
        clearInterval(s.timer);
        set_s({
          time: s.interval_length,
          finished_intervals: 0,
          timer: null
        });
      } else {
        beep();
        set_s({
          time: s.interval_length,
          finished_intervals: s.finished_intervals + 1
        });
      }
    }
    draw_svg(s.time / s.interval_length || 1);
  });

  let start = () => {
    if (s.timer) clearInterval(s.timer);
    let timer = setInterval(() => {
      set_s("time", (t) => t - 1);
    }, 1000);
    set_s({ timer: timer, time: s.interval_length });
  };

  let stop = () => {
    clearInterval(s.timer);
    set_s({
      time: s.interval_length,
      finished_intervals: 0,
      timer: null
    });
  };

  let set_to = (n) => {
    return () => {
      clearInterval(s.timer);
      set_s({ interval_length: n, time: n, finished_intervals: 0 });
    };
  };

  let set_total_intervals = (n) => {
    return () => {
      clearInterval(s.timer);
      set_s({
        time: s.interval_length,
        finished_intervals: 0,
        total_intervals: n
      });
    };
  };

  return (
    <div style={{ "max-width": 500 + "px", margin: "auto" }}>
      <div class="fit-width">
        <button
          class={s.total_intervals === 5 ? "selected" : ""}
          onclick={set_total_intervals(5)}
        >
          5
        </button>
        <button
          class={s.total_intervals === 10 ? "selected" : ""}
          onclick={set_total_intervals(10)}
        >
          10
        </button>
        <div style={{ padding: "6px" }}>
          {s.finished_intervals} / {s.total_intervals}
        </div>
      </div>
      <div class="fit-width">
        <IntervalLengthButton
          n={10}
          set_to={set_to}
          length={s.interval_length}
        />
        <IntervalLengthButton
          n={30}
          set_to={set_to}
          length={s.interval_length}
        />
        <IntervalLengthButton
          n={60}
          set_to={set_to}
          length={s.interval_length}
        />
        <IntervalLengthButton
          n={90}
          set_to={set_to}
          length={s.interval_length}
        />
        <IntervalLengthButton
          n={120}
          set_to={set_to}
          length={s.interval_length}
        />
      </div>
      <div class="relative-container">
        <div style={{ width: 250 + "px", height: 250 + "px" }} />
        <svg
          id="pie"
          class="inset-0"
          width="250"
          height="250"
          viewbox="0 0 250 250"
        >
          <path id="pie-path" transform="translate(125, 125), scale(-1, 1)" />
        </svg>
        <div class="center-container inset-0">
          <div class="time">{s.time}</div>
        </div>
      </div>
      <div class="center-container">
        <div class="fit-width">
          <button class="big" onclick={start}>
            start
          </button>
          <button class="big" onclick={stop}>
            stop
          </button>
        </div>
      </div>
    </div>
  );
};

render(App, document.getElementById("app"));
