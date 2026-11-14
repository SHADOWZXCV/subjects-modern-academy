// Stylelint checks the stylesheet for mistakes and holds the colour tokens; Oxfmt owns the
// layout.
/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // Off: blank lines are layout, which the formatter owns.
    "at-rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "rule-empty-line-before": null,
    // Older phones still open the timetable, and range media queries need Safari 16.4.
    "media-feature-range-notation": "prefix",
    // Off: the stylesheet uses both :not(a):not(b) and :not(a, b), and the two forms have
    // different specificity, so rewriting either one changes which rule wins.
    "selector-not-notation": null,
    // The scripts build class names with underscores (cell_gpa, gpa-btn_on) and one camel-case
    // part (cell-subjectCode); renaming them across the scripts is its own change.
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]*(?:[-_][a-zA-Z0-9]+)*$",
    // Off: it flags rules whose order the cascade does not depend on, such as "#a *" before
    // ".b *".
    "no-descending-specificity": null,
    // A rule takes its colours from the custom properties of :root.
    "scale-unlimited/declaration-strict-value": [
      ["/color$/", "fill", "stroke"],
      {
        ignoreValues: ["currentcolor", "transparent", "inherit"],
        expandShorthand: true,
        message: "Take the colour from a custom property of :root: var(--…)",
      },
    ],
  },
};
