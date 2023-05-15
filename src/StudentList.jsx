import { For, batch, onMount, createSignal } from "solid-js";
import styles from "./StudentList.module.css";

function StudentList(props) {
  const [hideKey, setHideKey] = createSignal([]);
  const [topSet, setTopSet] = createSignal([]);

  let list = [props.sheet];
  if (props.groupColumn) {
    const groupResult = props.sheet.reduce((acc, cur) => {
      const groupKey = cur[props.groupColumn];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(cur);
      return acc;
    }, {});
    list = Object.values(groupResult);
  }

  const handleStudentClick = (key) => {
    if (hideKey().includes(key)) {
      return;
    }

    if (topSet().length < props.topCount) {
      setTopSet((prev) => {
        return [...prev, key];
      });
    }
    setHideKey((prev) => {
      return [...prev, key];
    });
  };
  const width = 100 / list.length;

  return (
    <div class={styles.wrapper}>
      <For each={list}>
        {(group, groupIndex) => {
          return (
            <div
              style={{
                width: `${width}%`,
                "flex-grow": 0,
                "flex-shrink": 0,
                display: "flex",
                "flex-wrap": "wrap",
                "align-content": "flex-start",
                gap: "12px",
              }}
            >
              <For each={group}>
                {(item) => (
                  <div
                    class={styles.item}
                    classList={{
                      [styles.hidden]: hideKey().includes(
                        item[props.displayColumn]
                      ),
                      [styles.topItem]: topSet().includes(
                        item[props.displayColumn]
                      ),
                    }}
                    onClick={[handleStudentClick, item[props.displayColumn]]}
                  >
                    <div class={styles.front}>{item[props.displayColumn]}</div>
                    <div class={styles.back}>
                      <span class={styles.top}>
                        {topSet().indexOf(item[props.displayColumn]) + 1}
                      </span>
                      <span class={styles.topName}>
                        {item[props.displayColumn]}
                      </span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          );
        }}
      </For>
    </div>
  );
}

export default StudentList;
