log '[home] application code loaded.'

function main [
  log '[home] app started with main' [ get main ]
  set homeLine [
    get main addLine, call
  ]
  # log [ get homeLine ]
  get homeLine print, tell '#aceace' ' Terminal '
  get homeLine print, tell (
    '#f00000', '#f0f000', '#00f000', '#800000',
    '#f08000', '#008000', '#808080', '#c0c000',
  ) [ template ' %0 ' (
    File, Edit, Selection, View, Go, Run, Terminal, Help
  ) ] [ object [
    action [ function eX eY span [
      set actionType (
        File, Edit, Selection, View, Go, Run, Terminal, Help
      )
      log Clicked [ get actionType ] [ get span ] [ get eX ] [ get eY ]
    ] ]
    effect [
      function event x0 dx width height span [
        get event type, is click, true [
          set fn [ get span options action ]
          get fn, true [
            get fn, call [ get dx ] [ get event layerY ] [ get span ]
          ]
        ]
        set colorRef [ object [ value ] ]
        get event type, is click, true [
          set [ get colorRef ] value '#f0f080f0'
        ], false [
          set [ get colorRef ] value '#c0c080c0'
        ]
        global Array, call [
          list [
            [ get colorRef value ]
            [ get x0 ]
            0
            [ get width ]
            [ get height ]
          ]
        ]
      ] 
    ]
    type button
  ] ]
  get homeLine print, tell '#404040' [
    template ' %0 ' [
      global Date, new, at toLocaleTimeString, call
    ]
  ]
  get homeLine redraw, tell
  # return unmount function
  function [
    log '[home] app stopped'
  ]
]
