// Pixel-by-pixel doodle animation for the rightmost panel.
// Each doodle is drawn one connected component at a time (in DFS order),
// lingers, then is erased top-to-bottom, left-to-right.

const DOODLES = ['fish', 'flower', 'hello', 'lightning', 'smile', 'walk']
const PIXELS_PER_SECOND = 20
const LINGER_MS = 2000 // pause after a doodle is complete
const GAP_MS = 1000 // pause on the empty canvas between doodles

const canvas = document.getElementById('toy')
const ctx = canvas.getContext('2d')
const STEP_MS = 1000 / PIXELS_PER_SECOND

// --- Sizing -----------------------------------------------------------------

let cssWidth = 0
let cssHeight = 0

function resize() {
  const { clientWidth, clientHeight } = canvas.parentElement
  cssWidth = clientWidth
  cssHeight = clientHeight
  canvas.width = clientWidth * devicePixelRatio
  canvas.height = clientHeight * devicePixelRatio
  canvas.style.width = clientWidth + 'px'
  canvas.style.height = clientHeight + 'px'
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
}
new ResizeObserver(resize).observe(canvas.parentElement)

// --- Loading ----------------------------------------------------------------

// Returns { width, height, filled } where filled[y][x] is true for any
// non-transparent pixel.
async function loadDoodle(name) {
  const img = new Image()
  img.src = `/doodles/${name}.png`
  await img.decode()

  const off = document.createElement('canvas')
  off.width = img.width
  off.height = img.height
  const offCtx = off.getContext('2d')
  offCtx.drawImage(img, 0, 0)
  const data = offCtx.getImageData(0, 0, img.width, img.height).data

  const filled = []
  for (let y = 0; y < img.height; y++) {
    const row = []
    for (let x = 0; x < img.width; x++) {
      row.push(data[(y * img.width + x) * 4 + 3] > 0)
    }
    filled.push(row)
  }
  return { width: img.width, height: img.height, filled }
}

// --- Ordering ---------------------------------------------------------------

// Draw order: find connected components (8-way, so diagonal lines stay
// connected) by scanning top-to-bottom, left-to-right for an unvisited pixel,
// then walking its component with a DFS. Pixels come out in DFS visit order,
// one whole component after another.
function drawOrder({ width, height, filled }) {
  const visited = filled.map((row) => row.map(() => false))
  const order = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!filled[y][x] || visited[y][x]) continue

      const stack = [[x, y]]
      while (stack.length > 0) {
        const [cx, cy] = stack.pop()
        if (visited[cy][cx]) continue
        visited[cy][cx] = true
        order.push([cx, cy])

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx
            const ny = cy + dy
            if (
              nx >= 0 &&
              nx < width &&
              ny >= 0 &&
              ny < height &&
              filled[ny][nx] &&
              !visited[ny][nx]
            ) {
              stack.push([nx, ny])
            }
          }
        }
      }
    }
  }
  return order
}

// Erase order: top-to-bottom, left-to-right.
function eraseOrder(order) {
  return [...order].sort(([ax, ay], [bx, by]) => ay - by || ax - bx)
}

// --- Rendering --------------------------------------------------------------

function render(doodle, visible) {
  ctx.clearRect(0, 0, cssWidth, cssHeight)
  if (!doodle) return

  // Largest whole-number pixel size that fits, centered in the panel.
  const size = Math.max(
    1,
    Math.floor(Math.min(cssWidth / doodle.width, cssHeight / doodle.height)),
  )
  const left = Math.floor((cssWidth - doodle.width * size) / 2)
  const top = Math.floor((cssHeight - doodle.height * size) / 2)

  ctx.fillStyle = '#000'
  for (let y = 0; y < doodle.height; y++) {
    for (let x = 0; x < doodle.width; x++) {
      if (visible[y][x])
        ctx.fillRect(left + x * size, top + y * size, size, size)
    }
  }
}

// --- Animation loop ---------------------------------------------------------

async function main() {
  let doodles = await Promise.all(DOODLES.map(loadDoodle))

  let index = Math.floor(Math.random() * doodles.length)
  let doodle, visible, drawQueue, eraseQueue
  let phase // 'draw' | 'linger' | 'erase' | 'gap'
  let timer = 0 // ms accumulated in the current phase / step

  function start(i) {
    doodle = doodles[i]
    visible = doodle.filled.map((row) => row.map(() => false))
    drawQueue = drawOrder(doodle)
    eraseQueue = eraseOrder(drawQueue)
    phase = 'draw'
    timer = 0
  }
  start(index)

  let last = performance.now()
  function frame(now) {
    // Cap the step so returning to a background tab doesn't jump ahead.
    timer += Math.min(now - last, 250)
    last = now

    if (phase === 'draw' || phase === 'erase') {
      const queue = phase === 'draw' ? drawQueue : eraseQueue
      while (timer >= STEP_MS && queue.length > 0) {
        const [x, y] = queue.shift()
        visible[y][x] = phase === 'draw'
        timer -= STEP_MS
      }
      if (queue.length === 0) {
        phase = phase === 'draw' ? 'linger' : 'gap'
        timer = 0
      }
    } else if (phase === 'linger' && timer >= LINGER_MS) {
      phase = 'erase'
      timer = 0
    } else if (phase === 'gap' && timer >= GAP_MS) {
      index = Math.floor(Math.random() * doodles.length)
      start(index)
    }

    render(doodle, visible)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

main()
