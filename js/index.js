//    loadSpecificationData('./db/computer_engineering.json')
let GPA_MODE = false;

(() => {
  const side = document.getElementById("subject-info-container");
  const gpa_button = document.getElementById("gpa-feature-button");

  side.addEventListener("click", (e) => {
    if (e.target === side) unmountSubjectInfo();
  });

  gpa_button.addEventListener("click", (e) => {
    e.target.dataset.gpaToggle =
      e.target.dataset.gpaToggle === "on" ? "off" : "on";
    GPA_MODE = e.target.dataset.gpaToggle === "on";

    toggleClassModifierOfElement(GPA_MODE, e.target, "gpa-btn", "on", "off");
    e.target.innerText = GPA_MODE
      ? "Back to search mode"
      : "GPA Calculation Mode";

    if (GPA_MODE) gpaEnableInteraction();
    else gpaDisableInteraction();
  });

  loadSpecificationData("./db/computer_engineering.json").then((subjects) => {
    initTable(subjects);
  });
})();

function toggleClassModifierOfElement(
  state,
  elem,
  baseClass,
  onClass,
  offClass,
) {
  elem.classList.remove(`${baseClass}_${state ? offClass : onClass}`);
  elem.classList.add(`${baseClass}_${state ? onClass : offClass}`);
}

function renderTable() {
  // reset search and table holding position
  const searchForm = document.getElementsByName("search-entry")[0];
  searchForm.value = "";
  const holdBox = document.getElementsByName("search-hold")[0];
  holdBox.checked = false;

  const selected = document.getElementById("header-select-main").value;
  loadSpecificationData("./db/index.json").then((files) => {
    if (files[selected])
      loadSpecificationData(`./db/${files[selected]}.json`).then((subjects) => {
        // TODO
        // selectedElements.semesters = []
        initTable(subjects);
      });
  });
}

function highlightCellByCode(graph) {
  const searchForm = document.getElementById("search-bar");
  const search = new FormData(searchForm);
  const searchEntry = search.get("search-entry");
  const cell = document.querySelector(`[data-subject-id='${searchEntry}']`);
  const vertex = graph.search(searchEntry);

  if (!cell || !vertex) {
    resetHighlightedCells();
    return false;
  }

  highlightCell(cell, vertex, cell.dataset.optionalId);

  // Holds cell if a cell is found and the hold checkbox is checked
  if (isHeld()) holdCells();

  return false;
}
