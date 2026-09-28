import json as _json
import os as _os

from ._imports_ import *  # noqa: F401,F403
from ._imports_ import __all__

with open(_os.path.join(_os.path.dirname(__file__), "package-info.json")) as _f:
    __version__ = _json.load(_f)["version"]

# Tabulator and its CSS are bundled into dash_tabulator.min.js, so Dash can
# serve everything locally (its default) without reaching a CDN.
_js_dist = [
    {"relative_package_path": "dash_tabulator.min.js", "namespace": "dash_tabulator"},
    {
        "relative_package_path": "dash_tabulator.min.js.map",
        "namespace": "dash_tabulator",
        "dynamic": True,
    },
]
_css_dist = []

for _component in __all__:
    setattr(locals()[_component], "_js_dist", _js_dist)
    setattr(locals()[_component], "_css_dist", _css_dist)
