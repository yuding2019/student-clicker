import { createSignal, Show } from "solid-js";

import Setting from "./Setting";
import StudentList from "./StudentList";

import styles from "./App.module.css";

function App() {
  const [data, setData] = createSignal({
    sheet: [],
    groupColumn: "",
    displayColumn: "",
  });

  return (
    <div class={styles.wrapper}>
      <Show when={!data().sheet.length && !data().displayColumn}>
        <Setting onChange={(v) => setData(v)} />
      </Show>
      <Show when={data().sheet.length && data().displayColumn}>
        <StudentList {...data()} />
      </Show>
    </div>
  );
}

export default App;
