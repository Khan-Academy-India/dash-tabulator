import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {TabulatorFull as TabulatorEngine} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import "../styles/mantine.css";

const sparklineFormatter = (cell) => {
  const values = cell.getValue();
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const numeric = values.map(Number).filter(Number.isFinite);
  if (!numeric.length) {
    return "";
  }

  const width = 88;
  const height = 24;
  const pad = 2;
  const min = Math.min(...numeric);
  const max = Math.max(...numeric);
  const span = max - min || 1;
  const step = numeric.length === 1 ? 0 : (width - pad * 2) / (numeric.length - 1);

  const points = numeric
    .map((value, index) => {
      const x = pad + index * step;
      const y = height - pad - ((value - min) / span) * (height - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return `
    <svg class="dash-tabulator-sparkline" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <polyline points="${points}" fill="none" vector-effect="non-scaling-stroke"></polyline>
    </svg>
  `;
};

const mapColumn = (column) => {
  const mapped = {...column};

  if (Array.isArray(column.columns)) {
    mapped.columns = column.columns.map(mapColumn);
  }

  if (column.formatter === "sparkline") {
    mapped.formatter = sparklineFormatter;
  }

  return mapped;
};

const normalizeColumns = (columns = []) => columns.map(mapColumn);

const compactFilters = (filters = []) =>
  filters.map(({field, type, value}) => ({field, type, value}));

const emit = (setProps, payload) => {
  if (setProps) {
    setProps(payload);
  }
};

export default function Tabulator({
  id,
  data,
  columns,
  groupBy,
  height,
  layout,
  movableColumns,
  resetToken,
  className,
  style,
  setProps,
}) {
  const elementRef = useRef(null);
  const tableRef = useRef(null);
  const declaredColumnLayoutRef = useRef(null);
  const lastResetTokenRef = useRef(resetToken);

  useEffect(() => {
    if (!elementRef.current) {
      return undefined;
    }

    const table = new TabulatorEngine(elementRef.current, {
      data: data || [],
      columns: normalizeColumns(columns || []),
      groupBy: groupBy || false,
      height: height || "500px",
      layout: layout || "fitColumns",
      movableColumns: movableColumns !== false,
      columnCalcs: "both",
    });

    tableRef.current = table;

    table.on("tableBuilt", () => {
      declaredColumnLayoutRef.current = table.getColumnLayout();
      emit(setProps, {
        columnState: table.getColumnLayout(),
        filterState: compactFilters(table.getFilters(true)),
        eventData: {type: "tableBuilt"},
      });
    });

    table.on("columnMoved", () => {
      emit(setProps, {
        columnState: table.getColumnLayout(),
        eventData: {type: "columnMoved"},
      });
    });

    table.on("dataFiltered", (filters, rows) => {
      emit(setProps, {
        filterState: compactFilters(filters),
        eventData: {type: "dataFiltered", rowCount: rows.length},
      });
    });

    return () => {
      table.destroy();
      tableRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.replaceData(data || []);
    }
  }, [data]);

  useEffect(() => {
    if (!tableRef.current) {
      return;
    }

    tableRef.current.setColumns(normalizeColumns(columns || []));
    declaredColumnLayoutRef.current = tableRef.current.getColumnLayout();
    emit(setProps, {columnState: tableRef.current.getColumnLayout()});
  }, [columns]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.setGroupBy(groupBy || false);
    }
  }, [groupBy]);

  useEffect(() => {
    if (!tableRef.current || resetToken === lastResetTokenRef.current) {
      return;
    }

    lastResetTokenRef.current = resetToken;
    tableRef.current.clearFilter(true);
    tableRef.current.clearSort();

    if (declaredColumnLayoutRef.current) {
      tableRef.current.setColumnLayout(declaredColumnLayoutRef.current);
    }

    tableRef.current.setGroupBy(groupBy || false);

    emit(setProps, {
      columnState: tableRef.current.getColumnLayout(),
      filterState: [],
      eventData: {type: "reset"},
    });
  }, [resetToken]);

  const classes = ["dash-tabulator", className].filter(Boolean).join(" ");

  return (
    <div
      id={id}
      className={classes}
      style={style}
      ref={elementRef}
    />
  );
}

Tabulator.propTypes = {
  id: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  groupBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  layout: PropTypes.string,
  movableColumns: PropTypes.bool,
  resetToken: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  columnState: PropTypes.array,
  filterState: PropTypes.array,
  eventData: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  setProps: PropTypes.func,
};

Tabulator.defaultProps = {
  data: [],
  columns: [],
  groupBy: null,
  height: "500px",
  layout: "fitColumns",
  movableColumns: true,
  resetToken: 0,
};
