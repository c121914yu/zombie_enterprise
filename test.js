const fs = require("fs")
let data = fs.readFileSync("./src/assets/data.json")
data = JSON.parse(data)
let grad_cnn = data.grad_cam

for (let i in grad_cnn) {
  const item = grad_cnn[i]
  for (let j in item) {
    if (j !== "ID") {
      let random = Math.random()
      if (random < 0.4)
        random = 0
      else
        random *= (Math.random() * 0.8)
      grad_cnn[i][j] = random
    }
  }
}
data.grad_cam = grad_cnn
fs.writeFileSync("./src/assets/data2.json", JSON.stringify(data, null, "\t"), "utf-8")
// console.log(grad_cnn);