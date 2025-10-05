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
  set threshold [ value 127, multiply 3 ]
  set line [
    object [
      canvas [
        global document createElement, call canvas
      ]
      print [
        function color text [
          get text, typeof, = string, ( true, false ) (
            [
              log Print with color [ get color ] and text [ get text ]
              get line spans push, call [
                object [ color, text ]
              ]
              set [ get line ] size [ get line size, add [ get text length ] ]
              log after print [ get line spans ] size [ get line size ]
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
              get line context fillRect, call [ get x ] 0 [
                get span text length
                multiply [ get main config charWidth ]
              ] [ get main config lineHeight ]
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
          set [ get line canvas ] ( width, height ) [
            get main ( width, config lineHeight )
          ]
        ]
      ]
      size 0
      spans [ list ]
    ]
  ]
  
  get line canvas addEventListener, call mousemove [
    function event [
      log event [ get event ]
    ]
  ]
  
  set [ get line ] context [
    get line canvas getContext, call 2d
  ]
  
  global document body appendChild, call [ get line canvas ]
  
  get line resize, call
  
  get line
]
