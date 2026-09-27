# Dash Tabulator

A deliberately thin Dash wrapper around [Tabulator](https://tabulator.info/) for Khan Academy India dashboards.

## Scope

This package intentionally supports only the grid capabilities we need:

- per-column header filtering
- lightweight cell sparklines
- movable/reorderable columns
- row grouping
- grouped column headers
- totals and grouped subtotals
- reset to the declared column/group configuration
- small state outputs for filters and column layout
- Mantine-compatible styling by default

Tabulator remains responsible for filtering, sorting, grouping, aggregation, virtualization, and rendering in the browser. The Dash/React layer only translates JSON-serializable Dash props into Tabulator configuration and exposes a few useful events.

## Install

For an internal project with GitHub access:

```bash
pip install "git+https://github.com/Khan-Academy-India/dash-tabulator.git@main"
```

or with SSH:

```bash
pip install "git+ssh://git@github.com/Khan-Academy-India/dash-tabulator.git@main"
```

## Usage

```python
from dash import Dash, Input, Output, html
import dash_mantine_components as dmc

from kai_dash_tabulator import Tabulator

app = Dash(__name__)

rows = [
    {"state": "UP", "district": "Agra", "school": "School A", "students": 1200, "active": 910, "trend": [61, 65, 68, 72, 76]},
    {"state": "UP", "district": "Agra", "school": "School B", "students": 980, "active": 701, "trend": [58, 60, 59, 66, 71]},
]

columns = [
    {"title": "School", "field": "school", "headerFilter": True},
    {
        "title": "Roster",
        "columns": [
            {"title": "Students", "field": "students", "hozAlign": "right", "bottomCalc": "sum"},
            {"title": "Active", "field": "active", "hozAlign": "right", "bottomCalc": "sum"},
        ],
    },
    {"title": "Trend", "field": "trend", "formatter": "sparkline", "headerSort": False},
]

app.layout = dmc.MantineProvider(
    dmc.Stack(
        [
            dmc.Button("Reset view", id="reset"),
            Tabulator(
                id="grid",
                data=rows,
                columns=columns,
                groupBy=["state", "district"],
                height="520px",
            ),
        ]
    )
)

@app.callback(Output("grid", "resetToken"), Input("reset", "n_clicks"))
def reset_grid(n):
    return n or 0

if __name__ == "__main__":
    app.run(debug=True)
```

Only columns with `headerFilter` enabled display a filter. Nested `columns` create grouped headers. Built-in Tabulator calculations such as `sum`, `avg`, `min`, `max`, and `count` can be supplied through `topCalc` or `bottomCalc`.

### Sparkline cells

Use the built-in wrapper formatter:

```python
{"title": "Trend", "field": "trend", "formatter": "sparkline"}
```

The value should be an array of numbers. The formatter produces a small SVG and does not mount a React/Mantine component per cell.

## Mantine theme

The component uses the `kai-tabulator` theme automatically. It reads Mantine CSS variables such as `--mantine-color-body`, `--mantine-color-text`, `--mantine-color-default-border`, `--mantine-font-family`, and radius/spacing variables, with sensible fallbacks when Dash Mantine Components is not present.

There is no runtime dependency on `dash-mantine-components`.

## Props

| Prop | Purpose |
|---|---|
| `data` | Array of row objects |
| `columns` | Tabulator column definitions; must be JSON serializable |
| `groupBy` | Field name or ordered list of fields for row grouping |
| `height` | Grid height; defaults to `500px` |
| `layout` | Tabulator layout mode; defaults to `fitColumns` |
| `movableColumns` | Enables column drag/reordering; defaults to `True` |
| `resetToken` | Change this value to clear filters/sorts and restore declared columns/grouping |
| `columnState` | Read-only output containing `getColumnLayout()` |
| `filterState` | Read-only output containing current filters including header filters |
| `eventData` | Read-only compact event payload |
| `className`, `style` | Optional container customization |

The wrapper does not expose arbitrary JavaScript functions or the full Tabulator API by design.

## Development

```bash
python -m pip install "dash>=3"
npm install
npm run build
python -m build
```

Generated Dash Python component files and the production JavaScript bundle are committed so consumers only need Python/pip when installing the package.
