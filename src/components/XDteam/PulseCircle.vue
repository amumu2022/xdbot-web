<template>
  <div class="pulse-circle" :style="circleStyle" />
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "10px"
    },
    color: {
      type: String,
      default: "gray"
    }
  },
  computed: {
    circleStyle() {
      return {
        height: this.size,
        width: this.size,
        backgroundColor: this.color,
        borderRadius: "50%",
        display: "inline-block",
        animation: "pulse 2s infinite"
      };
    }
  }
};
</script>

<style>
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
