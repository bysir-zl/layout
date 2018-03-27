// 封装使用到的css解析器

import postcss from 'postcss' // postcss
import postcssJs from 'postcss-js' // css
import autoprefixer from 'autoprefixer' // 自动前缀
import nested from 'postcss-nested' // 嵌套语法
import variables from 'postcss-css-variables' // 支持变量 如:root{--a:#333}
import csso from 'postcss-csso' // 压缩

function processCssJs(cssJs) {
  return postcss([autoprefixer, nested, variables, csso]).process(
    cssJs, {parser: postcssJs}).css
}

export default processCssJs
