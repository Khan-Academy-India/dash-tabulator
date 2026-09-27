from dash import Dash, Input, Output
import dash_mantine_components as dmc
from kai_dash_tabulator import Tabulator

app = Dash(__name__)

rows = [
    {"state": "UP", "district": "Agra", "school": "School A", "students": 1200, "active": 910, "trend": [61, 65, 68, 72, 76]},
    {"state": "UP", "district": "Agra", "school": "School B", "students": 980, "active": 701, "trend": [58, 60, 59, 66, 71]},
    {"state": "UP", "district": "Lucknow", "school": "School C", "students": 1100, "active": 843, "trend": [62, 64, 67, 70, 74]},
]

columns = [
    {"title": "School", "field": "school", "headerFilter": True},
    {"title": "Roster", "columns": [
        {"title": "Students", "field": "students", "hozAlign": "right", "bottomCalc": "sum"},
        {"title": "Active", "field": "active", "hozAlign": "right", "bottomCalc": "sum"},
    ]},
    {"title": "Trend", "field": "trend", "formatter": "sparkline", "headerSort": False},
]

app.layout = dmc.MantineProvider(
    dmc.Stack([
        dmc.Group([dmc.Title("School performance", order=3), dmc.Button("Reset view", id="reset", variant="light")], justify="space-between"),
        Tabulator(id="grid", data=rows, columns=columns, groupBy=["state", "district"], height="520px"),
    ], p="md")
)

@app.callback(Output("grid", "resetToken"), Input("reset", "n_clicks"))
def reset_grid(n):
    return n or 0

if __name__ == "__main__":
    app.run(debug=True)
