<template>
  <ToggleColumns
    :getPage="returnPagename"
    :leftButton="$t('common.forms.advancedFilters')"
    :centerCol="9"
    v-if="isMounted"
  >
    <template slot="top">
      <RecommendationsCharts />
    </template>

    <template slot="left">
      <OracleFilters v-if="returnCloudTechnology === 'Oracle'">
        <Loading :isLoading="loadingTableStatus" />
      </OracleFilters>

      <AwsFilters v-if="returnCloudTechnology === 'Aws'">
        <Loading :isLoading="loadingTableStatus" />
      </AwsFilters>

      <GoogleFilters v-if="returnCloudTechnology === 'Google'">
        <Loading :isLoading="loadingTableStatus" />
      </GoogleFilters>

      <AllRecommendationsFilters
        v-if="returnCloudTechnology === 'allRecommendations'"
      >
        <Loading :isLoading="loadingTableStatus" />
      </AllRecommendationsFilters>
    </template>

    <template slot="center">
      <OracleTableList v-if="returnCloudTechnology === 'Oracle'" />
      <AwsTableList v-if="returnCloudTechnology === 'Aws'" />
      <GoogleTableList v-if="returnCloudTechnology === 'Google'" />
      <AllRecommendationsList
        v-if="returnCloudTechnology === 'allRecommendations'"
      />
    </template>
  </ToggleColumns>
</template>

<script>
import { bus } from '@/helpers/eventBus.js'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ToggleColumns from '@/components/common/ToggleColumns.vue'
import Loading from '@/components/common/Loading.vue'

import OracleFilters from '@/components/cloud/oracle/recommendations/Filters.vue'
import OracleTableList from '@/components/cloud/oracle/recommendations/TableList.vue'

import AwsFilters from '@/components/cloud/aws/recommendations/Filters.vue'
import AwsTableList from '@/components/cloud/aws/recommendations/TableList.vue'

import GoogleFilters from '@/components/cloud/google/recommendations/Filters.vue'
import GoogleTableList from '@/components/cloud/google/recommendations/TableList.vue'

import AllRecommendationsFilters from '@/components/cloud/allRecommendations/Filters.vue'
import AllRecommendationsList from '@/components/cloud/allRecommendations/TableList.vue'

import RecommendationsCharts from '@/components/cloud/RecommendationsCharts.vue'

export default {
  name: 'recommendations-page',
  components: {
    ToggleColumns,
    OracleFilters,
    OracleTableList,
    AwsFilters,
    AwsTableList,
    RecommendationsCharts,
    GoogleFilters,
    GoogleTableList,
    AllRecommendationsFilters,
    AllRecommendationsList,
    Loading,
  },
  data() {
    return {
      isMounted: false,
    }
  },
  async beforeMount() {
    if (this.$route.name === 'allRecommendations') {
      this.SET_CLOUD_TECHNOLOGY('allRecommendations')
      await this.getCloudAllRecommendations().then(() => {
        bus.$emit('data', this.returnCloudAllRecommendations)
      })
    } else {
      if (this.$route.name === 'oracle-recommendations') {
        this.SET_CLOUD_TECHNOLOGY('Oracle')
      } else if (this.$route.name === 'aws-recommendations') {
        this.SET_CLOUD_TECHNOLOGY('Aws')
      } else if (this.$route.name === 'google-recommendations') {
        this.SET_CLOUD_TECHNOLOGY('Google')
      }

      await this.getCloudRecommendations().then(() => {
        bus.$emit('data', this.returnCloudRecommendations)
      })
    }
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    ...mapActions(['getCloudRecommendations', 'getCloudAllRecommendations']),
    ...mapMutations(['SET_CLOUD_TECHNOLOGY']),
  },
  computed: {
    ...mapGetters([
      'returnCloudTechnology',
      'returnCloudRecommendations',
      'returnCloudAllRecommendations',
      'loadingTableStatus',
    ]),
    returnPagename() {
      return `recommendations${this.returnCloudTechnology}`
    },
  },
}
</script>

<style lang="scss" scoped></style>
