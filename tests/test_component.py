from dash_tabulator import Tabulator


def test_component_namespace_and_props():
    grid = Tabulator(
        id="grid",
        data=[{"district": "Agra", "students": 10}],
        columns=[{"title": "District", "field": "district", "headerFilter": True}],
        groupBy="district",
        movableColumns=True,
        resetToken=0,
    )
    assert grid._namespace == "dash_tabulator"
    assert grid._type == "Tabulator"
    assert grid.data[0]["students"] == 10
    assert grid.columns[0]["headerFilter"] is True


def test_nested_columns_and_sparkline_are_json_serializable():
    grid = Tabulator(
        columns=[
            {"title": "Usage", "columns": [{"title": "Students", "field": "students", "bottomCalc": "sum"}]},
            {"title": "Trend", "field": "trend", "formatter": "sparkline"},
        ]
    )
    assert grid.columns[0]["columns"][0]["bottomCalc"] == "sum"
    assert grid.columns[1]["formatter"] == "sparkline"
