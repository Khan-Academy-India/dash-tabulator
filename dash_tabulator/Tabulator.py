# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args
try:
    from dash.types import NumberType  # noqa: F401
except ImportError:
    # Backwards compatibility for dash<=4.1.0
    if typing.TYPE_CHECKING:
        raise
    NumberType = typing.Union[  # noqa: F401
        typing.SupportsFloat, typing.SupportsInt, typing.SupportsComplex
    ]

ComponentSingleType = typing.Union[str, int, float, Component, None]
ComponentType = typing.Union[
    ComponentSingleType,
    typing.Sequence[ComponentSingleType],
]


class Tabulator(Component):
    """A Tabulator component.
A thin Dash wrapper around Tabulator: header filters, grouped headers,
row grouping, totals, sparkline cells and a reset action.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- className (string; optional):
    Extra CSS class for the container.

- columnState (list; optional):
    Read-only: the current column layout.

- columns (list of dicts; optional):
    Tabulator column definitions; nested `columns` create grouped
    headers.

- data (list of dicts; optional):
    Array of row objects.

- eventData (dict; optional):
    Read-only: the latest table event, e.g. {type: \"dataFiltered\",
    rowCount}.

- filterState (list; optional):
    Read-only: the current filters, including header filters.

- groupBy (string | list of strings; optional):
    Field name or ordered list of field names for row grouping.

- height (string | number; default "500px"):
    Fixed grid height. Ignored when `maxHeight` is set.

- layout (string; default "fitColumns"):
    Tabulator layout mode.

- maxHeight (string | number; optional):
    Grow with the rows up to this height, then scroll.

- movableColumns (boolean; default True):
    Allow dragging columns to reorder them.

- resetToken (string | number | boolean; default 0):
    Change this value to clear filters/sorts and restore the declared
    columns and grouping."""
    _children_props: typing.List[str] = []
    _base_nodes = ['children']
    _namespace = 'dash_tabulator'
    _type = 'Tabulator'


    def __init__(
        self,
        id: typing.Optional[typing.Union[str, dict]] = None,
        data: typing.Optional[typing.Sequence[dict]] = None,
        columns: typing.Optional[typing.Sequence[dict]] = None,
        groupBy: typing.Optional[typing.Union[str, typing.Sequence[str]]] = None,
        height: typing.Optional[typing.Union[str, NumberType]] = None,
        maxHeight: typing.Optional[typing.Union[str, NumberType]] = None,
        layout: typing.Optional[str] = None,
        movableColumns: typing.Optional[bool] = None,
        resetToken: typing.Optional[typing.Union[str, NumberType, bool]] = None,
        columnState: typing.Optional[typing.Sequence] = None,
        filterState: typing.Optional[typing.Sequence] = None,
        eventData: typing.Optional[dict] = None,
        className: typing.Optional[str] = None,
        style: typing.Optional[typing.Any] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'className', 'columnState', 'columns', 'data', 'eventData', 'filterState', 'groupBy', 'height', 'layout', 'maxHeight', 'movableColumns', 'resetToken', 'style']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'className', 'columnState', 'columns', 'data', 'eventData', 'filterState', 'groupBy', 'height', 'layout', 'maxHeight', 'movableColumns', 'resetToken', 'style']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(Tabulator, self).__init__(**args)

setattr(Tabulator, "__init__", _explicitize_args(Tabulator.__init__))
