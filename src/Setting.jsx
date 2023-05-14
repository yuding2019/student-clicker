import { Show, createSignal } from "solid-js";

import excelSvg from "./assets/excel.svg";
import rightSvg from "./assets/right.svg";

import styles from "./Setting.module.css";

function Select(props) {
  return (
    <div class={styles.select}>
      <div class={styles.selectWrap}>
        <span class={styles.label}>{props.label}</span>
        <select onChange={props.onChange} value={props.value}>
          {props.options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <span class={styles.arrow}></span>
      </div>
      <span class={styles.desc}>{props.desc}</span>
    </div>
  );
}

function Setting(props) {
  const [excelName, setExcelName] = createSignal("");
  const [sheet, setSheet] = createSignal(null);

  const [groupColumn, setGroupColumn] = createSignal("");
  const [displayColumn, setDisplayColumn] = createSignal("");

  const handleExcelChange = (e) => {
    setExcelName(e.target.files[0].name);
    // 使用xlsx解析excel文件，获取第一个sheet的数据
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = window.XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      setSheet(window.XLSX.utils.sheet_to_json(sheet));
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };

  const handleComplete = () => {
    if (!displayColumn()) {
      return;
    }
    props.onChange({
      sheet: sheet(),
      groupColumn: groupColumn(),
      displayColumn: displayColumn(),
    });
  };

  return (
    <div class={styles.wrapper}>
      <div class={styles.fileWrap}>
        <label for="excelFile" class={styles.fileLabel}>
          {excelName() ? (
            <div class={styles.fileName}>
              <img class={styles.excel} src={excelSvg} />
              <span>{excelName()}</span>
            </div>
          ) : (
            "Select excel file"
          )}
        </label>
        {/* 只接受excel类文件 */}
        <input
          type="file"
          class={styles.excelFile}
          id="excelFile"
          accept=".xlsx, .xls"
          onChange={handleExcelChange}
        />
      </div>
      <Show when={sheet()}>
        <div class={styles.result}>
          <div>
            共 <span class={styles.count}>{sheet().length}</span> 条数据
          </div>
          <div class={styles.sheetWrap}>
            <Select
              value={displayColumn()}
              label="展示列名"
              options={Object.keys(sheet()[0]).map((key) => ({
                value: key,
                label: key,
              }))}
              desc="使用选择的列进行展示"
              onChange={(e) => setDisplayColumn(e.target.value)}
            />
            <Select
              value={groupColumn()}
              label="分组列名"
              options={Object.keys(sheet()[0]).map((key) => ({
                value: key,
                label: key,
              }))}
              desc="使用选择的列进行分组"
              onChange={(e) => setGroupColumn(e.target.value)}
            />
          </div>
          <div class={styles.completeBtn} onClick={handleComplete}>
            <img class={styles.right} src={rightSvg} />
          </div>
        </div>
      </Show>
    </div>
  );
}

export default Setting;
