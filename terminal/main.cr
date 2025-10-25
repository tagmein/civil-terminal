log ( Hello,  Welcome to ) (
      there!, Civil Terminal.
)

set line [ load ./line.cr, point ]

set apps [
  object [
    home [ load /apps/home.cr, point ]
  ]
]

log  Available apps [ get apps ]

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
    enterApp [ function appName [
      log enterApp [ get appName ]
      get appName, is home
      true [
        log 'Launch app home' [ get apps home ]
        set unmount [
          # log main will be [ get main ]
          get apps home, call [ get main ]
        ]
        get main mountedApps home
        false [
          set [ get main mountedApps ] home [ get unmount ]
        ]
        log 'Launched home, to unmount' [ get main mountedApps home ]
      ]
    ] ]
    exitApp [ function [
      
    ] ]
    mountedApps [
      object
    ]
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
  list 0 1 2 3 4 5 6 7 8 9, each [ function i [ get i toString, call 10 ] ], at join, call ' '
]
get mainLine print, tell ( '#f0f080', '#80f0f0', '#f080f0') ( 'a', 'b', 'c' )

get main resize, call

global addEventListener, call resize [ get main resize ]

global setTimeout
call [ function [
  log 'Starting main app...'
  get main enterApp
  call home
  log [ get main ]
  get mainLine destroy, call
] ] 100

get main
