// логика ресайза таблицы
import {$} from '@core/dom'

export function resizeHandler($root, event) {
  return new Promise(resolve => {
    const $resizer = $(event.target)
    // const $parent = $resizer.$el.parentElement // плохой способ
    const $parent = $resizer.closest('[data-type="resizable"]') // получить ближайшего родителя по условию
    const coords = $parent.getCoords() // Взять координаты
    const type = $resizer.data.resize
    const sideProp = type === 'col' ? 'bottom' : 'right'

    $resizer.css({opacity: 1, [sideProp]: '-2000px'})
    let value
    document.onmousemove = e => {
      if (type === 'col') {
        const delta = Math.floor(e.pageX - coords.right) // Вычислить дельту
        value = (coords.width + delta)
        $resizer.css({right: -delta + 'px'})
      } else {
        const delta = Math.floor(e.pageY - coords.bottom) // Вычислить дельту
        value = (coords.height + delta)
        $resizer.css({bottom: -delta + 'px'})
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      if (type === 'col') {
        $parent.css({width: value + 'px'})
        // при отпускании мыши находит все ячейки под колонкой и делает ресайз
        $root.findAll(`[data-col="${$parent.data.col}"]`)
          .forEach(el => el.style.width = value + 'px')
      } else {
        $parent.css({height: value + 'px'})
      }
      resolve({
        value,
        type,
        // id: type === 'col' ? $parent.data.col : $parent.data.row, ниже аналог
        id: $parent.data[type]
      })
      $resizer.css({opacity: 0, bottom: 0, right: 0})
    }
  })
}
