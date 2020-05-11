onmessage = function(e) {
	let {enterprise,tempArr,fileData} = e.data
	
	fileData.forEach(item => {
		for(let i=0;i<item.data.length;i++){
			const dataList = item.data[i]
			const title = [...item.title]
			// ID不匹配跳过
			if(dataList[0] != enterprise[0].ID)
				continue
			let year = ""
			if(title.indexOf("year") > -1){ // 包含年份
				year = dataList[title.indexOf("year")]
				title[title.indexOf("year")] = "第几年的企业信息"
			}
			dataList.forEach((val,index) => {
				let keyText = title[index]
				let key = tempArr.find(param => keyText === param.text)
				if(key){
					// list类型的val转化
					if(key.hasOwnProperty("list")){
						const selectRes = key.list.find(content => {
							if(content.label === val){
								val = content.value
								return true
							}
						})
					}
					// 不含年份信息
					if(year === "")
						for(let j=0;j<enterprise.length;j++)
							enterprise[j][key.model] = val
					else{ //分年份
						let currentYearEn = enterprise.find((en,j) => {
							if(en.year === year){
								enterprise[j][key.model] = val
								return true
							}
						})
						if(!currentYearEn)
							enterprise.find((en,j) => {
								if(en.year === ""){
									enterprise[j][key.model] = val
									return true
								}
							})
					}
				}
			})
			item.data.splice(i,1)
			i--
		}
	})
	
	postMessage({
		enterprise,
		fileData
	})
}