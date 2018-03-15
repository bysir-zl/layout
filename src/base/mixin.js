export default {
  style: {
    data() {
      return {
        x_classed: []
      }
    },
    computed: {
      style() {
        return this.props.style
      },
      classes() {
        return this.props.style
      }
    },

  }
}
