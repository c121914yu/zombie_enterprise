onmessage = function(e) {
	let {files,resultID} = e.data
	let fileData = []
	var loadIndex = 0
	
	files.forEach((file,fIndex) => {
		let reader = new FileReader()
		reader.readAsText(file)
		reader.onload = (e) => {
			loadIndex++
			let result = e.target.result.split("\n")
			result.splice(result.length-1,1)
			// 将字符串转数字
			result.forEach((item,i) => {
				item = item.trim()
				item = item.split(",")
				item.forEach((data,index) => {
					if(data != "" && !isNaN(+data))
						item[index] = +data
				})
				result[i] = item
			})
			
			fileData.push({
				title: result[0],
				data: result.slice(1)
			})
			
			if(fIndex === 0)
				for(let i=1;i<result.length;i++){
					const id = result[i][0]
					if(resultID.indexOf(id) === -1)
						resultID.push(id)
				}
			
			if(loadIndex === files.length)
				postMessage({
					fileData,
					resultID
				})	
		}
	})
}

