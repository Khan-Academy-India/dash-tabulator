from .Tabulator import Tabulator

__version__ = "0.1.0"

_js_dist = [
    {
        "external_url": "https://unpkg.com/tabulator-tables@6.5.0/dist/js/tabulator.min.js",
        "namespace": "dash_tabulator",
    },
    {
        "relative_package_path": "dash_tabulator.min.js",
        "namespace": "dash_tabulator",
    },
]

_css_dist = [
    {
        "external_url": "https://unpkg.com/tabulator-tables@6.5.0/dist/css/tabulator.min.css",
        "namespace": "dash_tabulator",
    },
    {
        "relative_package_path": "mantine.css",
        "namespace": "dash_tabulator",
    },
]

Tabulator._js_dist = _js_dist
Tabulator._css_dist = _css_dist

__all__ = ["Tabulator"]
