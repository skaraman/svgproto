module.exports = {
  'objects': {
    'esperanza': {
      'stand': 'esperanza/stand',
      'left1': 'esperanza/left1',
      'left2': 'esperanza/left2',
      'right1': 'esperanza/right1',
      'right2': 'esperanza/right2',
      'right3': 'esperanza/right3'
    },
    'hitObject': {
      'circle': 'test/circle',
      'triangle': 'test/triangle'
    },
    'testObject': {
      'test1': 'test/test1',
      'test2': 'test/test2'

    }
  },
  'animations': {
    'esperanza': {
      'leftPunch': [{
          'from': 'stand',
          'to': 'left1',
          'timeframe': 60
        },
        {
          'from': 'left1',
          'to': 'left2',
          'timeframe': 60
        },
        {
          'from': 'left2',
          'to': 'left1',
          'timeframe': 60
        },
        {
          'from': 'left1',
          'to': 'stand',
          'timeframe': 60
        }
      ],
      'rightPunch': [{
          'from': 'stand',
          'to': 'right1',
          'timeframe': 60
        },
        {
          'from': 'right1',
          'to': 'right2',
          'timeframe': 60
        },
        {
          'from': 'right2',
          'to': 'right3',
          'timeframe': 60
        },
        {
          'from': 'right3',
          'to': 'left1',
          'timeframe': 60
        },
        {
          'from': 'left1',
          'to': 'stand',
          'timeframe': 60
        }
      ]
    },
    'hitObject': {
      'hit': [{
        'from': 'circle',
        'to': 'triangle',
        'timeframe': 15
      }],
      'return': [{
        'from': 'triangle',
        'to': 'circle',
        'timeframe': 15
      }]
    },
    'testObject': {
      'testObjAni': [
        {
          to: 'test2',
          from: 'test1',
          timeframe: 30
        }
      ]
    }
  }
}