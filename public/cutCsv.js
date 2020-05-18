onmessage = function(e) {
	let {resultID,Data,fileData,tempArr,param} = e.data
	let str = ""
	// 组成title
	for(let i=0;i<tempArr.length;i++){
		if(i != tempArr.length-1)
			str += (tempArr[i].text + ",")
		else
			str += (tempArr[i].text + "\n")
	}
	
	// 遍历resultID，对应下标的Data若不为数组则查询对应的fileData
	for(let i=0;i<resultID.length;i++){
		if(i >= 10 && i<= resultID.length-5) continue
		if(!Data[i]){
			Data[i] = getData(resultID[i])
			toStr(Data[i])
		}
	}
	postMessage(str)
	
	function toStr(Data){
		Data.forEach(data => {
			for(let i=0;i<tempArr.length;i++){
				if(i != tempArr.length-1)
					str += (data[tempArr[i].model] + ",")
				else
					str += (data[tempArr[i].model] + "\n")
			}
		})
	}
	
	function getData(ID){
		let enterprise = [
			{...param,ID},
			{...param,ID},
			{...param,ID}
		]
		fileData.forEach(item => {
			let succcessIndex = 0
			for(let i=0;i<item.data.length;i++){
				const dataList = item.data[i]
				const title = [...item.title]
				
				// 读取不含年份的信息时读取到1个直接跳出，读取有年份的的信息 >=3 时跳出
				if(title.indexOf("year") === -1 && succcessIndex >= 1)
					return false
				if(title.indexOf("year") >-1 && succcessIndex >= 3)
					return false
				// ID不匹配跳过
				if(dataList[0] != enterprise[0].ID)
					continue
					
				succcessIndex++
				dataList.forEach((val,index) => {
					let keyText = title[index]
					let key = tempArr.find(param => keyText === param.text)
					if(key){
						// 不含年份信息
						if(title.indexOf("year") === -1)
							for(let j=0;j<enterprise.length;j++)
								enterprise[j][key.model] = val
						else{ //包含年份
							let currentYearEn = enterprise.find((en,j) => {
								if(en.year === dataList[title.indexOf("year")]){
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
		return enterprise
	}
}
