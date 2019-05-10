module.exports = {
  "objects": {
    "esperanza": {
      "stand": "esperanza/stand",
      "left1": "esperanza/left1",
      "left2": "esperanza/left2",
      "left3": "esperanza/left3",
      "right1": "esperanza/right1",
      "right2": "esperanza/right2",
      "right3": "esperanza/right3"
    },
    "testObject2": {
      "circle": "test/circle",
      "triangle": "test/triangle"
    }
  },
  "animations": {
    "esperanza": {
      "leftPunch": [{
          "from": "stand",
          "to": "left1",
          "timeframe": 15
        },
        {
          "from": "left1",
          "to": "left2",
          "timeframe": 15
        },
        {
          "from": "left2",
          "to": "left3",
          "timeframe": 15
        },
        {
          "from": "left3",
          "to": "stand",
          "timeframe": 15
        }
      ],
      "rightPunch": [{
          "from": "stand",
          "to": "right1",
          "timeframe": 15
        },
        {
          "from": "right1",
          "to": "right2",
          "timeframe": 15
        },
        {
          "from": "right2",
          "to": "right3",
          "timeframe": 15
        },
        {
          "from": "right3",
          "to": "left3",
          "timeframe": 15
        },
        {
          "from": "left3",
          "to": "stand",
          "timeframe": 15
        }
      ]
    },
    "testObject2": {
      "testAnimation": [{
        "from": "circle",
        "to": "triangle",
        "timeframe": 120
      }]
    }
  }
}