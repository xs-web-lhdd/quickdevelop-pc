// 处理文章时间显示
export function handleArticleDateShow(date) {
  if (date == null) return 'Unknown time'
  date = date.slice(0, 10)

  let myDate = new Date();
  let currentYear = myDate.getFullYear()
  let currentMonth = myDate.getMonth() + 1
  let currentDay = myDate.getDate()

  let arr = date.split('-')
  arr[0] = parseInt(arr[0])
  arr[1] = parseInt(arr[1])
  arr[2] = parseInt(arr[2])

  // 判断是否是今天
  if (arr[0] == currentYear && arr[1] == currentMonth && arr[2] == currentDay) {
    return '今天'
  }

  if (arr[0] == currentYear) {
    return arr[1] + '月' + arr[2] + '日'
  } else {
    return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
  }
}