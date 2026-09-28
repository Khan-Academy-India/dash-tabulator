from pathlib import Path

from dash import Dash, html

import dash_tabulator
from dash_tabulator import Tabulator

PACKAGE = Path(dash_tabulator.__file__).parent


def test_component_namespace_and_props():
    grid = Tabulator(
        id="grid",
        data=[{"district": "Agra", "students": 10}],
        columns=[{"title": "District", "field": "district", "headerFilter": True}],
        groupBy="district",
        maxHeight="400px",
        movableColumns=True,
        resetToken=0,
    )
    assert grid._namespace == "dash_tabulator"
    assert grid._type == "Tabulator"
    assert grid.data[0]["students"] == 10
    assert grid.columns[0]["headerFilter"] is True
    assert grid.maxHeight == "400px"


def test_nested_columns_and_sparkline_are_json_serializable():
    grid = Tabulator(
        columns=[
            {"title": "Usage", "columns": [{"title": "Students", "field": "students", "bottomCalc": "sum"}]},
            {"title": "Trend", "field": "trend", "formatter": "sparkline"},
        ]
    )
    assert grid.columns[0]["columns"][0]["bottomCalc"] == "sum"
    assert grid.columns[1]["formatter"] == "sparkline"


def test_assets_are_local_and_bundle_tabulator():
    for resource in dash_tabulator._js_dist + dash_tabulator._css_dist:
        assert "external_url" not in resource
        assert (PACKAGE / resource["relative_package_path"]).is_file()
    bundle = (PACKAGE / "dash_tabulator.min.js").read_text()
    assert "tabulator-tableholder" in bundle  # Tabulator engine and CSS are inside the bundle


def test_served_page_references_only_local_assets():
    app = Dash(__name__)
    app.layout = html.Div(Tabulator(id="grid"))
    with app.server.test_request_context("/"):
        page = app.index()
    assert "/_dash-component-suites/dash_tabulator/dash_tabulator" in page
    assert "unpkg.com" not in page
