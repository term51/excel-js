import {Page} from '@core/page/Page'
import {createStore} from '@core/store/createStore'
import {rootReducer} from '@/redux/rootReducer'
import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {Formula} from '@/components/formula/Formula'
import {Table} from '@/components/table/Table'
import {normalizeInitialState} from '@/redux/initialState'
import {StateProcessor} from '@core/page/StateProcessor'
import {LocalStorageClient} from '@/shared/LocalStorageClient'


export class ExcelPage extends Page {
  // Dependency Inversion Principle (применив данный принцип в будущем можно будет избежать большего рефакторинга)
  constructor(param) {
    super(param)

    this.storeSub = null
    this.processor = new StateProcessor(
      // теперь тут можно подключить разные клиенты для работы с данными
      new LocalStorageClient(this.params)
    )
  }

  async getRoot() {
    const state = await this.processor.get()
    // подписка
    const store = createStore(rootReducer, normalizeInitialState(state))

    this.storeSub = store.subscribe(this.processor.listen)

    this.excel = new Excel({
      // Передаем компоненты в Excel для последущего рендеринга
      components: [Header, Toolbar, Formula, Table],
      store
    })

    return this.excel.getRoot()
  }

  // подключение слушателей
  afterRender() {
    this.excel.init()
  }

  destroy() {
    this.excel.destroy()
    this.storeSub.unsubscribe()
  }
}
