import Vue from 'vue';

import {
  Button,
  Image,
  Input,
  Form,
  FormItem,
  TabPane,
  Tabs,
  Message,
  Backtop,
  Icon,
  Option,
  Select,
  MessageBox,
  Dialog,
  Pagination,
  Loading,
  Upload,
  Steps,
  Step,
  Popover,
  Radio,
} from 'element-ui'

Vue.use(Button)
Vue.use(Image)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Backtop)
Vue.use(Icon)
Vue.use(Option)
Vue.use(Select)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(Upload)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Popover)
Vue.use(Radio)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm