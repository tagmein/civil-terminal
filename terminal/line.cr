set calculateBrightness [
  function color [
    add *[
      list 1 3 5, each [
        function i [
          global parseInt, call [
            get color substr, call [ get i ] 2
          ] 16
        ]
      ]
    ]
  ]
]

function main [
  set threshold [ value 127, multiply 1.75 ]
  set line [
    object [
      canvas [
        global document createElement, call canvas
      ]
      effectCanvas [
        set c [ global document createElement, call canvas ]
        get c classList add, call effect
        get c
      ]
      destroy [ function [
        get line canvas remove, call
        get line effectCanvas remove, call
      ] ]
      print [
        function color text options [
          get text, typeof, = string, ( true, false ) (
            [
              # log Print with color [ get color ] and text [ get text ]
              get line spans push, call [
                object [ color, text, options ]
              ]
              set [ get line ] size [ get line size, add [ get text length ] ]
              # log after print [ get line spans ] size [ get line size ]
            ]
            [ error 'Text to print must be a string.' ]
          )
        ]
      ]
      redraw [
        function [
          set highWaterMark [
            object [ value 0 ]
          ]
          set [ get line context ] font [
            get main config font, default '12px monospace'
          ]
          get line spans, each [
            function span [
              set [ get line context ] fillStyle [ get span color ]
              set x [
                get highWaterMark value
                multiply [ get main config charWidth ]
              ]
              set spanW [
                get span text length
                multiply [ get main config charWidth ]
              ]
              set spanH [ get main config lineHeight ]
              get line context fillRect, call [ get x ] 0 [ get spanW ] [ get spanH ]
              get span options, true [
                # log Print span options [ get span options ]
                get span options type, is button, true [
                  set [ get line context ] fillStyle '#ffffff80'
                  get line context fillRect
                  call [ get x ] 0 [ get spanW ] [ get spanH, divide 8 ]
                  set [ get line context ] fillStyle '#ffffff60'
                  get line context fillRect
                  call [ get x ] 0 [ get spanW ] [ get spanH, divide 4 ]
                  set [ get line context ] fillStyle '#00000080'
                  get line context fillRect
                  call [ get x ] [ get spanH, divide 8, multiply 7 ] [ get spanW ] [ get spanH, divide 8 ]
                  set [ get line context ] fillStyle '#00000060'
                  get line context fillRect
                  call [ get x ] [ get spanH, divide 4, multiply 3 ] [ get spanW ] [ get spanH, divide 4 ]
                ]
              ]
              get calculateBrightness, call [ get span color ]
               > [ get threshold ], ( true, false ) [
                set [ get line context ] fillStyle ( '#000000', '#ffffff' )
              ]
              get span text split, call '', each [
                function char index [
                  set x [
                    get highWaterMark value
                    add [ get index ]
                    multiply [ get main config charWidth ]
                  ]
                  get line context fillText, call [
                    get span text charAt, call [ get index ]
                  ] [ get x ] [ get main config verticalAlign, default 20 ]
                ]
              ]
              set [ get highWaterMark ] value [
                get highWaterMark value, add [ get span text length ]
              ]
              # log highWaterMark [ get highWaterMark value ]
            ]
          ]
        ]
      ]
      resize [
        function [
          set [ get line ( canvas, canvas, effectCanvas, effectCanvas ) ] (
            width, height, width, height
          ) [
            get main ( width, config lineHeight, width, config lineHeight )
          ]
        ]
      ]
      size 0
      spans [ list ]
    ]
  ]

  set clearEffect [
    function [
      get line effectContext clearRect, call 0 0 [ get line canvas width ] [ get line canvas height ]
    ]
  ]
  
  set drawMouse [
    function event [
      set [ get line effectContext ] fillStyle '#00000080'
      get line effectContext fillRect, call [ get event clientX, subtract 2 ] [ get event clientY, subtract 2 ] 5 5
      set [ get line effectContext ] fillStyle '#00000020'
      list 10 20 30 40 50 60, each [
        function size [
          get line effectContext fillRect, call [ get event clientX, subtract 1 ] [ get event clientY, subtract 1 ] [ get size ] [ get size ]
        ]
      ]
      set [ get line effectContext ] fillStyle '#ffffff80'
      list 1 2 3 4, each [
        function size [
          get line effectContext fillRect, call [ get event clientX, subtract 1 ] [ get event clientY, subtract 1 ] [ get size ] [ get size ]
        ]
      ]
      set [ get line effectContext ] fillStyle '#40800080'
      get line effectContext fillRect, call [ get event clientX, subtract 1 ] 0 1 [ get event clientY, subtract 4 ]
      get line effectContext fillRect, call [ get event clientX, subtract 1 ] [ get event clientY, add 4 ] 1 [ get main config lineHeight ] 
      get line effectContext fillRect, call 0 [ get event clientY, subtract 1 ] [ get event clientX, subtract 4 ] 1
      get line effectContext fillRect, call [ get event clientX, add 4 ] [ get event clientY, subtract 1 ] [ get main width ] 1 
      set [ get line effectContext ] fillStyle '#80ff0080'
      get line effectContext fillRect, call [ get event clientX ] 0 1 [ get event clientY, subtract 4 ]
      get line effectContext fillRect, call [ get event clientX ] [ get event clientY, add 4 ] 1 [ get main config lineHeight ] 
      get line effectContext fillRect, call 0 [ get event clientY ] [ get event clientX, subtract 4 ] 1
      get line effectContext fillRect, call [ get event clientX, add 4 ] [ get event clientY ] [ get main width ] 1 
    ]
  ]
  
  list mousemove mouseenter mouseout mousedown mouseup click
  each [
    function type [
      get line canvas addEventListener, call [ get type ] [
        function event [
          get clearEffect, call
          set highWaterMark [ object [ value 0 ] ]
          # log [ get main config charWidth ] spans [ get line spans ]
          get line spans, each [
            function span [
              set [ get line context ] fillStyle [ get span color ]
              set x [
                get highWaterMark value
                multiply [ get main config charWidth ]
              ]
              set spanW [
                get span text length
                multiply [ get main config charWidth ]
              ]
              set [ get highWaterMark ] value [ get highWaterMark value, add [ get span text length ] ]
              # log Comparing [ get x ] [ get event clientX ] [ get x, add [ get spanW ] ] width of [ get spanW ]
              get event clientX, >= [ get x ], true [
                get event clientX, < [ get x, add [ get spanW ] ], true [
                  # log event: [ get type ] [ get span ]
                  get span options, true [
                    get span options effect
                    true [
                      set effectPlan [ object [ value ] ]
                      set [ get effectPlan ] value [
                        get span options effect, call [ get event ] [ get x ] [ get event clientX, subtract [ get highWaterMark value ] ] [ get spanW ] [ get main config lineHeight ] [ get span ]
                      ]
                      get effectPlan value, each [
                        function effectItem [
                          # log effectItem [ get effectItem ] [ get effectItem 0 ] [ get effectItem 4 ]
                          set fillStyle [ get effectItem 0 ]
                          set x0 [ get effectItem 1 ]
                          set y0 [ get effectItem 2 ]
                          set dx [ get effectItem 3 ]
                          set dy [ get effectItem 4 ]
                          set [ get line effectContext ] fillStyle [ get fillStyle ]
                          get line effectContext fillRect, call [ get x0 ] [ get y0 ] [ get dx ] [ get dy ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
          get event type, is mouseout
          false [
            get drawMouse, call [ get event ]
          ]
        ]
      ]
    ] 
  ]
  
  set [ get line ] context [
    get line canvas getContext, call 2d
  ]
  
  set [ get line ] effectContext [
    get line effectCanvas getContext, call 2d
  ]
  
  global document body appendChild, call [ get line canvas ]
  global document body appendChild, call [ get line effectCanvas ]
  
  get line resize, call
  
  get line
]
