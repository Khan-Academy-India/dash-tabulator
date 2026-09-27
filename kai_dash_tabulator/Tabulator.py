from dash.development.base_component import Component, _explicitize_args


class Tabulator(Component):
    _namespace = "kai_dash_tabulator"
    _type = "Tabulator"
    _children_props = []
    _base_nodes = ["children"]
    _valid_wildcard_attributes = []
    available_properties = [
        "id", "data", "columns", "groupBy", "height", "layout",
        "movableColumns", "resetToken", "columnState", "filterState",
        "eventData", "className", "style",
    ]
    available_wildcard_properties = []

    @_explicitize_args
    def __init__(
        self,
        id=Component.UNDEFINED,
        data=Component.UNDEFINED,
        columns=Component.UNDEFINED,
        groupBy=Component.UNDEFINED,
        height=Component.UNDEFINED,
        layout=Component.UNDEFINED,
        movableColumns=Component.UNDEFINED,
        resetToken=Component.UNDEFINED,
        columnState=Component.UNDEFINED,
        filterState=Component.UNDEFINED,
        eventData=Component.UNDEFINED,
        className=Component.UNDEFINED,
        style=Component.UNDEFINED,
        **kwargs,
    ):
        self._prop_names = self.available_properties
        self._valid_wildcard_attributes = []
        self.available_properties = self._prop_names
        self.available_wildcard_properties = []
        _explicit_args = kwargs.pop("_explicit_args")
        _locals = locals()
        _locals.update(kwargs)
        args = {k: _locals[k] for k in _explicit_args if k != "children"}
        super().__init__(**args)
