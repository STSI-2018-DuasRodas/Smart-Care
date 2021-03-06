<template>
  <div class="root-dashboard-view">
    <template v-if="isMobile">
      <dashboard-mobile
        :orders="orders"
        :is-loading="isLoading"
        :has-errors="hasErrors"
      />
    </template>

    <template v-else>
      <dashboard-web
        :orders="orders"
        :custom-styles="customStyles"
        :quantity="quantity"
        :chart-style="chartStyle"
        :labels="labels"
        :is-loading="isLoading"
        :has-errors="hasErrors"
        :loaded="loaded"
      />
    </template>
  </div>
</template>

<script>
import { getToken } from '../../utils/utils';
import { mapGetters } from 'vuex';

export default {
  components: {
    DashboardMobile: () => import('./mobile/Dashboard-mobile.vue'),
    DashboardWeb: () => import('./web/Dashboard-web.vue'),
  },
  data() {
    return {
      orders: {},
      hasErrors: false,
      isLoading: false,
      loaded: false,
      quantity: [],
      labels: [],
      chartStyle: {
        label: 'Ordens',
        borderColor: '#F34336',
        pointBackgroundColor: '#F34336',
        borderWidth: 2,
        pointBorderColor: '#F34336',
        backgroundColor: 'rgb(243,67,54,0.7)',
        responsive: true,
        maintainAspectRatio: false,
        legend: true,
        ticksY: true,
        gridLinesY: true,
        gridLinesX: false,
      },
      customStyles: {
        height: '300px',
        width: '62vw',
      },
    };
  },
  computed: {
    ...mapGetters({
      isMobile: 'getIsMobile',
    }),
  },
  mounted() {
    this.$store.commit('addPageName', 'Dashboard');
    this.$store.commit('setMainIcon', 'fa-home');

    this.getOrdersSummary();
    this.getLastOrderByMonth();
  },
  
  methods: {
    async getOrdersSummary() {
      try {
        this.isLoading = true;
        
        const orders = await this.$http.microserviceAnalisis('analysis/order-summary');

        if (!orders || orders === undefined) {
          this.hasErrors = true;
          return;
        }
        
        this.orders = orders;
      } catch (err) {
        console.log('err dashboard => ', err);
        this.hasErrors = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getLastOrderByMonth() {
      try {
        this.resetState();

        const response = await this.$http.microserviceAnalisis('analysis/last-month');

        this.quantity = response.map(order => order.Quantity);
        this.labels = response.map(order => this.$moment(order.OpeningDate).format('DD-MM-YYYY'));

        this.loaded = true;
      } catch (error) {
        console.log(error);
      }
    },
    resetState() {
      this.loaded = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.root-dashboard-view {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
