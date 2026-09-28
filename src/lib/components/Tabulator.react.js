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

/**
 * A thin Dash wrapper around Tabulator: header filters, grouped headers,
 * row grouping, totals, sparkline cells and a reset action.
 */
export default function Tabulator(props) {
  const {id, data, columns, groupBy, height, maxHeight, layout, movableColumns, resetToken,
    className, style} = props;
  const elementRef = useRef(null);
  const tableRef = useRef(null);
  const builtRef = useRef(false);
  const lastResetTokenRef = useRef(resetToken);
  // Tabulator events outlive renders; read the latest props through a ref.
  const latestRef = useRef(props);
  latestRef.current = props;

  const emit = (payload) => {
    if (latestRef.current.setProps) {
      latestRef.current.setProps(payload);
    }
  };

  useEffect(() => {
    if (!elementRef.current) {
      return undefined;
    }

    const initial = latestRef.current;
    const table = new TabulatorEngine(elementRef.current, {
      data: initial.data || [],
      columns: normalizeColumns(initial.columns || []),
      groupBy: initial.groupBy || false,
      height: initial.maxHeight ? undefined : initial.height || "500px",
      maxHeight: initial.maxHeight || undefined,
      layout: initial.layout || "fitColumns",
      movableColumns: initial.movableColumns !== false,
      columnCalcs: "both",
    });
    tableRef.current = table;

    // Tabulator rejects setColumns/replaceData until the table is built, so
    // prop changes that arrive earlier are applied here instead.
    table.on("tableBuilt", () => {
      builtRef.current = true;
      const latest = latestRef.current;
      if (latest.columns !== initial.columns) {
        table.setColumns(normalizeColumns(latest.columns || []));
      }
      if (latest.data !== initial.data) {
        table.replaceData(latest.data || []);
      }
      if (latest.groupBy !== initial.groupBy) {
        table.setGroupBy(latest.groupBy || false);
      }
      emit({
        columnState: table.getColumnLayout(),
        filterState: compactFilters(table.getFilters(true)),
        eventData: {type: "tableBuilt"},
      });
    });

    table.on("columnMoved", () => {
      emit({columnState: table.getColumnLayout(), eventData: {type: "columnMoved"}});
    });

    table.on("dataFiltered", (filters, rows) => {
      emit({
        filterState: compactFilters(filters),
        eventData: {type: "dataFiltered", rowCount: rows.length},
      });
    });

    return () => {
      builtRef.current = false;
      table.destroy();
      tableRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (builtRef.current) {
      tableRef.current.replaceData(data || []);
    }
  }, [data]);

  useEffect(() => {
    if (!builtRef.current) {
      return;
    }
    const table = tableRef.current;
    table.setColumns(normalizeColumns(columns || []));
    emit({columnState: table.getColumnLayout()});
  }, [columns]);

  useEffect(() => {
    if (builtRef.current) {
      tableRef.current.setGroupBy(groupBy || false);
    }
  }, [groupBy]);

  useEffect(() => {
    if (!builtRef.current || resetToken === lastResetTokenRef.current) {
      return;
    }
    lastResetTokenRef.current = resetToken;
    const table = tableRef.current;
    table.clearFilter(true);
    table.clearSort();
    // Re-applying the declared columns restores order and widths; Tabulator's
    // setColumnLayout cannot restore grouped headers.
    table.setColumns(normalizeColumns(columns || []));
    table.setGroupBy(groupBy || false);
    emit({columnState: table.getColumnLayout(), filterState: [], eventData: {type: "reset"}});
  }, [resetToken]);

  const classes = ["dash-tabulator", className].filter(Boolean).join(" ");

  return <div id={id} className={classes} style={style} ref={elementRef} />;
}

Tabulator.propTypes = {
  /** The ID used to identify this component in Dash callbacks. */
  id: PropTypes.string,
  /** Array of row objects. */
  data: PropTypes.arrayOf(PropTypes.object),
  /** Tabulator column definitions; nested `columns` create grouped headers. */
  columns: PropTypes.arrayOf(PropTypes.object),
  /** Field name or ordered list of field names for row grouping. */
  groupBy: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  /** Fixed grid height. Ignored when `maxHeight` is set. */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Grow with the rows up to this height, then scroll. */
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Tabulator layout mode. */
  layout: PropTypes.string,
  /** Allow dragging columns to reorder them. */
  movableColumns: PropTypes.bool,
  /** Change this value to clear filters/sorts and restore the declared columns and grouping. */
  resetToken: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  /** Read-only: the current column layout. */
  columnState: PropTypes.array,
  /** Read-only: the current filters, including header filters. */
  filterState: PropTypes.array,
  /** Read-only: the latest table event, e.g. {type: "dataFiltered", rowCount}. */
  eventData: PropTypes.object,
  /** Extra CSS class for the container. */
  className: PropTypes.string,
  /** Inline styles for the container. */
  style: PropTypes.object,
  /** Dash-assigned callback that updates props. */
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
