import testScene from 'data/testScene'
import pocaDemo from 'data/pocaDemo'

let manifest = {
  "loadingScene": {
    "objects": {
      "loadingCircle": {
        "1": "loading/l1",
        "2": "loading/l2",
        "3": "loading/l3",
        "4": "loading/l4",
        "5": "loading/l5",
        "6": "loading/l6",
        "7": "loading/l7",
        "8": "loading/l8",
        "9": "loading/l9",
        "10": "loading/l10",
        "11": "loading/l11",
        "12": "loading/l12",
        "13": "loading/l13",
        "14": "loading/l14",
        "15": "loading/l15",
        "16": "loading/l16"
      },
      "testObject": {
        "box": "test/box",
        "star": "test/star"
      },
      "testObject2": {
        "circle": "test/circle",
        "triangle": "test/triangle"
      }
    },
    "animations": {
      "loadingCircle": {
        "loadingAnimation": [{
            "from": "1",
            "to": "2",
            "timeframe": 15
          },
          {
            "from": "2",
            "to": "3",
            "timeframe": 15
          },
          {
            "from": "3",
            "to": "4",
            "timeframe": 15
          },
          {
            "from": "4",
            "to": "5",
            "timeframe": 15
          },
          {
            "from": "5",
            "to": "6",
            "timeframe": 15
          },
          {
            "from": "6",
            "to": "7",
            "timeframe": 15
          },
          {
            "from": "7",
            "to": "8",
            "timeframe": 15
          },
          {
            "from": "8",
            "to": "9",
            "timeframe": 15
          },
          {
            "from": "9",
            "to": "10",
            "timeframe": 15
          },
          {
            "from": "10",
            "to": "11",
            "timeframe": 15
          },
          {
            "from": "11",
            "to": "12",
            "timeframe": 15
          },
          {
            "from": "12",
            "to": "13",
            "timeframe": 15
          },
          {
            "from": "13",
            "to": "14",
            "timeframe": 15
          },
          {
            "from": "14",
            "to": "15",
            "timeframe": 15
          },
          {
            "from": "15",
            "to": "16",
            "timeframe": 15
          },
          {
            "from": "16",
            "to": "1",
            "timeframe": 15
          }
        ]
      },
      "testObject": {
        "testAnimation": [{
          "from": "box",
          "to": "star",
          "timeframe": 60
        }]
      },
      "testObject2": {
        "testAnimation": [{
          "from": "circle",
          "to": "triangle",
          "timeframe": 120
        }]
      }
    }
  },
  "testScene": testScene,
  "pocaDemo": pocaDemo
}

export default manifest