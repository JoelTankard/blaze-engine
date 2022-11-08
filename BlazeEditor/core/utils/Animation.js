const ease = (t, b, c, d) => {
  t /= (d / 2)
  if (t < 1) { return c / 2 * t * t + b }
  return -c / 2 * ((--t) * (t - 2) - 1) + b
}

export {
  ease
}
