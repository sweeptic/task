import React from "react";
import { createRoot } from "react-dom/client";

const issues = [
  { id: 201, title: "Add pagination to orders list", status: "open", priority: "high", assignee: "alex" },
  { id: 202, title: "Fix alignment of profile avatar", status: "closed", priority: "low", assignee: "sam" },
  { id: 203, title: "Improve keyboard nav in sidebar", status: "open", priority: "medium", assignee: "casey" },
  { id: 204, title: "Refactor token refresh", status: "open", priority: "high", assignee: "morgan" },
  { id: 205, title: "Migrate modals to accessible API", status: "closed", priority: "medium", assignee: "riley" },
  { id: 206, title: "Optimize bundle split", status: "open", priority: "low", assignee: "sam" },
];

function App() {
  const [query, setQuery] = React.useState("");
  const [openOnly, setOpenOnly] = React.useState(false);
  const [sortDir, setSortDir] = React.useState(ORDER_STATE.desc); // 'asc' | 'desc'
  const [issuesList, _] = React.useState(issues);
  const [priorityFilter, setPriorityFilter] = React.useState(PRIORITY_STATE.all);

  const priorityDisabled = priorityFilter !== PRIORITY_STATE.all;

  const filteredIssues = React.useMemo(() => {
    const queryString = query.trim().toLowerCase();

    return [...issuesList]
      .filter(byStatus(openOnly))
      .filter(byTitleOrAssignee(queryString))
      .filter(byPriority(priorityFilter))
      .sort(orderByPriority(sortDir));
  }, [query, openOnly, sortDir, priorityFilter]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", margin: 24, color: "#1f2937" }}>
      <h1>Issue Dashboard</h1>

      <Filters
        query={query}
        onQueryChange={setQuery}
        openOnly={openOnly}
        onOpenOnlyChange={setOpenOnly}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        // Add an additional filter control here for Priority (All/Low/Medium/High).
      />

      {/* This summary reads from the same array passed to the list, so any unexpected ordering is easy to notice. */}
      <div style={{ color: "#6b7280", margin: "8px 0 12px" }}>
        First result: <em>{filteredIssues[0]?.title ?? "—"}</em>
      </div>

      <IssueList issues={filteredIssues} sortDir={sortDir} setSortDir={setSortDir} priorityDisabled={priorityDisabled} />
    </div>
  );
}

function Filters({ query, onQueryChange, openOnly, onOpenOnlyChange, priorityFilter, setPriorityFilter }) {
  return (
    <div
      className="card"
      role="region"
      aria-label="Issue filters"
      style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, margin: "8px 0" }}
    >
      <div className="row" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          <span className="sr-only">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search title or assignee"
            aria-label="Search issues"
            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", minWidth: 220 }}
          />
        </label>

        <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={openOnly} onChange={(e) => onOpenOnlyChange(e.target.checked)} aria-label="Open issues only" />
          Open only
        </label>
        <label style={{ display: "inline-flex", gap: 8, alignItems: "center", paddingLeft: "1rem" }}>
          <Select
            label="Filter by priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              { value: PRIORITY_STATE.all, label: "All" },
              { value: PRIORITY_STATE.low, label: "Low" },
              { value: PRIORITY_STATE.medium, label: "Medium" },
              { value: PRIORITY_STATE.high, label: "High" },
            ]}
            placeholder="Priority"
          />
        </label>

        {/* Add a Priority select here using the Select component below. */}
        {/* Example usage pattern is in IssueList (Sort direction). */}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, disabled, placeholder = "Select..." }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const priorityWeight = { low: 1, medium: 2, high: 3 };

function IssueList({ issues, sortDir, setSortDir, priorityDisabled }) {
  // Intentionally sorts the incoming array directly (observe behavior when interacting with filters and sort).

  return (
    <section aria-label="Issues">
      <div className="row" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", margin: "8px 0" }}>
        <div>
          <strong>{issues.length}</strong> result{issues.length !== 1 ? "s" : ""}
        </div>
        <div className="row" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Select
            label="Sort by priority"
            value={sortDir}
            onChange={setSortDir}
            options={
              priorityDisabled
                ? [{ value: sortDir, label: "Disabled" }]
                : [
                    { value: ORDER_STATE.desc, label: "High → Low" },
                    { value: ORDER_STATE.asc, label: "Low → High" },
                  ]
            }
            placeholder="Direction"
            disabled={priorityDisabled}
          />
        </div>
      </div>

      {issues.map((it) => (
        <IssueRow key={it.id} issue={it} />
      ))}
    </section>
  );
}

function IssueRow({ issue }) {
  const statusClass = issue.status === CHECKBOX_STATE.open ? "open" : "closed";
  const statusLabel = issue.status === CHECKBOX_STATE.open ? "Open" : "Closed";
  const priorityLabel = issue.priority[0].toUpperCase() + issue.priority.slice(1);

  return (
    <article
      className="card"
      role="article"
      aria-labelledby={`issue-${issue.id}-title`}
      style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, margin: "8px 0" }}
    >
      <div className="row" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <strong id={`issue-${issue.id}-title`}>{issue.title}</strong>
          <span
            className="tag"
            title={`Assignee: ${issue.assignee}`}
            aria-label={`Assignee ${issue.assignee}`}
            style={{
              display: "inline-block",
              background: "#eef2ff",
              color: "#3730a3",
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 12,
              marginLeft: 6,
            }}
          >
            @{issue.assignee}
          </span>
        </div>
        <div className="row" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            className={`badge ${statusClass}`}
            aria-label={`Status ${statusLabel}`}
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 12,
              lineHeight: 1.5,
              background: statusClass === "open" ? "#ecfdf5" : "#f3f4f6",
              color: statusClass === "open" ? "#065f46" : "#374151",
            }}
          >
            {statusLabel}
          </span>
          <span
            className="tag"
            aria-label={`Priority ${priorityLabel}`}
            style={{
              display: "inline-block",
              background: "#eef2ff",
              color: "#3730a3",
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 12,
            }}
          >
            {priorityLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

// utils
function orderByPriority(sortDir) {
  return (a, b) => {
    const d = priorityWeight[b.priority] - priorityWeight[a.priority];
    return sortDir === ORDER_STATE.asc ? -d : d;
  };
}

function byStatus(openOnly) {
  return (it) => (openOnly ? it.status === CHECKBOX_STATE.open : true);
}

function byTitleOrAssignee(query) {
  return (it) => (query ? it.title.toLowerCase().includes(query) || it.assignee.toLowerCase().includes(query) : true);
}

function byPriority(priority) {
  return (it) => (priority === PRIORITY_STATE.all ? true : priority === it.priority);
}

// enums
const CHECKBOX_STATE = {
  open: "open",
};

const PRIORITY_STATE = {
  all: "all",
  low: "low",
  medium: "medium",
  high: "high",
};

const ORDER_STATE = {
  asc: "asc",
  desc: "desc",
};

Object.freeze(CHECKBOX_STATE, PRIORITY_STATE, ORDER_STATE);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
