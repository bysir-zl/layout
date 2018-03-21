
// 键值对生成数组, 要求键值对只能是简单的字符串键值对, 生成的数组元素是由 key+value 组成的
export default function (obj,spe) {
  return _.map(obj,(v,k)=>k+(spe?spe:'')+v)
}
