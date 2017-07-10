const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
let ballX = 50
let ballY = 50
let ballSpeedX = 10
let ballSpeedY = 4
let player1Score = 0
let player2Score = 0

const WINNING_SCORE = 3
let showingWinScreen = false
let paddle1Y = 250
let paddle2Y = 250
const PADDLE_HEIGHT = 100
const PADDLE_THICKNESS = 10

const framesPerSecond = 30

function calculateMousePos(e) {
  const rect = canvas.getBoundingClientRect()
  const root = document.documentElement
  const mouseX = e.clientX - rect.left - root.scrollLeft
  const mouseY = e.clientY - rect.top - root.scrollTop

  return {
    x: mouseX,
    y: mouseY
  }
}

function handleMouseClick(e) {
  if (showingWinScreen) {
    player1Score = 0
    player2Score = 0
    showingWinScreen = false
  }
}

setInterval(function() {
  moveEverything()
  drawEverything()
}, 1000 / framesPerSecond)

canvas.addEventListener('mousemove', function(e) {
  const mousePos = calculateMousePos(e)
  paddle1Y = mousePos.y - PADDLE_HEIGHT / 2
})

canvas.addEventListener('mousedown', handleMouseClick)

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true
  }
  ballSpeedX = -ballSpeedX
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

function computerMovement() {
  const paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6
  }
}

function secondPlayerMovement() {
  document.addEventListener('keydown', function(e) {
    console.log(e.keyCode)
    // up
    if (e.keyCode === 38 || e.which === 38) {
      if (paddle2Y === 0) {
        console.log('hahah')
        return
      } else {
        paddle2Y -= 1
      }
    }
    //down
    if (e.keyCode === 40 || e.which === 40) {
      if (paddle2Y >= 500) {
        paddle2Y = paddle2Y
      } else {
        paddle2Y += 1
      }
    }
  })
}

function moveEverything() {
  computerMovement()
  //secondPlayerMovement()
  ballX += ballSpeedX
  ballY += ballSpeedY
  if (ballX < 0) {
    //
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX
      const deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2)
      ballSpeedY = deltaY * 0.35
    } else {
      player2Score++

      ballReset()
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX
      const deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2)
      ballSpeedY = deltaY * 0.35
    } else {
      player1Score++

      ballReset()
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY
  }
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white')
  }
}

function drawEverything() {
  // next line blinks out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, 'black')
  if (showingWinScreen) {
    ctx.fillStyle = 'white'
    if (player1Score >= WINNING_SCORE) {
      ctx.fillText('Left Player Won!', 350, 200)
    } else if (player2Score >= WINNING_SCORE) {
      ctx.fillText('Right Player Won!', 350, 200)
    }
    ctx.fillStyle = 'white'
    ctx.fillText('Click to continue', 350, 500)
    return
  }

  drawNet()
  // this is the left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white')
  // this is the right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    'white'
  )
  // next line draws the ball
  colorCircle(ballX, ballY, 10, 'white')

  ctx.fillText(player2Score, canvas.width - 100, 100)
  ctx.fillText(player1Score, 100, 100)
}

function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
  ctx.fill()
}

function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor
  ctx.fillRect(leftX, topY, width, height)
}

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
