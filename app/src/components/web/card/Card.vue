<template>
  <div
    class="root-card-component"
    :class="{
      'w-100': fullWidth,
      'w-100 d-flex justify-content-center': centered,
    }"
  >
    <div ref="customCard" class="custom-card" :style="`width: ${getCustomWidth} !important`">
      <div
        v-if="advancedCard"
        class="d-flex justify-content-between align-items-center cursor-pointer"
        @click="collapseCard()"
      >
        <div class="d-flex">
          <div class="card-presentation-icon shadow">
            <i class="fa fa-lg" :class="icon" />
          </div>
          <div class="mx-3">
            <h5 class="text-muted user-select-none">{{ customTitle }}</h5>
          </div>
        </div>

        <div class="d-flex justify-content-center align-content-center cursor-pointer">
          <i class="fa text-muted fa-lg" :class="collapsed ? 'fa-chevron-up' : 'fa-chevron-down'" style="user-select: none" />
        </div>
      </div>

      <transition name="slide-down" mode="out-in">
        <div
          v-if="collapsed"
          :class="advancedCard ? 'mt-4' : ''"
          :style="advancedCard ? 'overflow: auto' : ''"
        >
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    fullWidth: { type: Boolean, default: false },
    advancedCard: { type: Boolean, default: false },
    customTitle: { type: String, default: '' },
    open: { type: Boolean, default: true },
    icon: { type: String, default: '' },
    customWidth: { type: String, default: '' },
    centered: { type: Boolean, default: false },
  },
  data() {
    return {
      collapsed: this.open,
    };
  },
  computed: {
    getCustomWidth() {
      if (this.customWidth.includes('px')) return this.customWidth;
      return `${this.customWidth}px`;
    },
  },
  mounted() {
    if (!this.advancedCard) this.$refs.customCard.style.maxHeight = '100%';
    if (this.advancedCard) this.$refs.customCard.style.minHeight = '62px';
    if (!this.open) this.$refs.customCard.style.maxHeight = '62px';
  },
  methods: {
    collapseCard() {
      this.collapsed
        ? this.$refs.customCard.style.maxHeight = '62px'
        : this.$refs.customCard.style.maxHeight = '900px';
      
      this.collapsed = !this.collapsed;
      this.emit();
    },
    emit() {
      this.$emit('collapsed', this.collapsed);
    },
  },
};
</script>

<style lang="scss" scoped>
.root-card-component {
  width: 70%;
  .custom-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    max-height: 900px;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 1px 2px 4px 0px #d4d4d4;
    transition: .4s ease;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f1f1f1 }
  ::-webkit-scrollbar-thumb { background: rgb(172, 172, 172); border-radius: 100px; }
  ::-webkit-scrollbar-thumb:hover { background: rgb(116, 116, 116) }
}
@media screen and (max-width: 1366px) {
  .root-card-component {
    width: 100% !important;
  }
}
</style>
