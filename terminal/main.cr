log ( Hello,  Welcome to ) (
      there!, Civil Terminal.
)

set line [ load ./line.cr, point ]

set config [
  object [
    charWidth     8
    font          '12px "Liberation Mono", monospace'
    lineHeight    24
    verticalAlign 16
  ]
]

set main [
  object [
    addLine [
      function [
        set newLine [
          get line, call [ get main ]
        ]
        get main lines push, call [ get newLine ]
        get newLine
      ]
    ]
    config [ get config ]
    lines [ list ]
    redraw [
      function [
        get main lines, each [
          function line lineIndex [
            get line redraw, call
          ]
        ]
      ]
    ]
    resize [
      function [
        set rows [
          global Math ceil, call [
            global window innerHeight, divide [ get config lineHeight ]
          ]
        ]
        get rows, = 1, ( true, false ) [
          log [ template ( '%0 row', '%0 rows' ) [ get rows ] ]
        ]
        set [ get main ] ( rows, width ) [ ( get rows, global window innerWidth ) ]
        get main lines, each [
          function l [
            get l resize, call
          ]
        ]
        get main redraw, call
      ]
    ]
  ]
]

set mainLine [ get main addLine, call ]

get mainLine print, tell ( '#f08080', '#80f080', '#8080f0') 'Hello World'
get mainLine print, tell  '#404040' [
  list 1 2 3, each [ function i [ get i toString, call 10 ] ], at join, call ' '
]
get mainLine print, tell ( '#f0f080', '#80f0f0', '#f080f0') ( '1', '2', '3' )

get main resize, call

global addEventListener, call resize [ get main resize ]

get main
