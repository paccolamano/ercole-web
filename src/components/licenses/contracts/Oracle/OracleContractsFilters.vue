<template>
  <AdvancedFiltersBase :submitAction="apply">
    <Collapse :collapses="collapses">
      <template slot="General">
        <CustomField label="Location">
          <CustomAutocomplete
            v-model="filters.location"
            :filterResult="filteredlocation"
            :filterMethod="setAutocompletes"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.agreeNumber')">
          <CustomAutocomplete
            v-model="filters.contractID"
            :filterResult="filteredcontractID"
            :filterMethod="setAutocompletes"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.fullAgreement')">
          <CustomSelectAutocomplete
            v-model="filters.fullPartNumber"
            :filterResult="filteredfullPartNumber"
            :filterMethod="setAutocompletes"
            field="fullPartNumber"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.metric')">
          <CustomAutocomplete
            v-model="filters.metric"
            :filterResult="filteredmetric"
            :filterMethod="setAutocompletes"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.csi')">
          <CustomAutocomplete
            v-model="filters.csi"
            :filterResult="filteredcsi"
            :filterMethod="setAutocompletes"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.refNumber')">
          <CustomAutocomplete
            v-model="filters.referenceNumber"
            :filterResult="filteredreferenceNumber"
            :filterMethod="setAutocompletes"
            v-if="toggleReferenceNumber"
          />
        </CustomField>

        <!-- <CustomField label="Support Expiration">
          <CustomDatepicker v-model="filters.supportExpiration" />
        </CustomField> -->

        <CustomField :label="$t('common.fields.ula')">
          <CustomRadio v-model="filters.unlimited" />
        </CustomField>

        <CustomField :label="$t('common.fields.licPerCore')">
          <CustomSlider
            v-model="filters.licensesPerCore"
            :ticks="[minlicensesPerCore, maxlicensesPerCore]"
            :steps="1"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.licPerUser')">
          <CustomSlider
            v-model="filters.licensesPerUser"
            :ticks="[minlicensesPerUser, maxlicensesPerUser]"
            :steps="1"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.avLicPerCore')">
          <CustomSlider
            v-model="filters.availableLicensesPerCore"
            :ticks="[minavailableLicensesPerCore, maxavailableLicensesPerCore]"
            :steps="1"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.avLicPerUser')">
          <CustomSlider
            v-model="filters.availableLicensesPerUser"
            :ticks="[minavailableLicensesPerUser, maxavailableLicensesPerUser]"
            :steps="1"
          />
        </CustomField>

        <CustomField :label="$t('common.fields.basket')">
          <CustomRadio v-model="filters.basket" />
        </CustomField>

        <CustomField :label="$t('common.fields.restricted')">
          <CustomRadio v-model="filters.restricted" />
        </CustomField>
      </template>
    </Collapse>

    <slot />
  </AdvancedFiltersBase>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import localFiltersMixin from '@/mixins/localFiltersMixin.js'
import CustomSelectAutocomplete from '@/components/common/Form/CustomSelectAutocomplete.vue'
import Collapse from '@/components/common/Collapse.vue'

export default {
  name: 'licenses-contracts-oracle-filters-component',
  mixins: [localFiltersMixin],
  components: {
    CustomSelectAutocomplete,
    Collapse,
  },
  data() {
    return {
      collapses: ['General'],
      autocompletes: [
        'contractID',
        'csi',
        'referenceNumber',
        'fullPartNumber',
        'metric',
        'location',
      ],
      selects: ['referenceNumber'],
      sliders: [
        'licensesPerCore',
        'licensesPerUser',
        'availableLicensesPerCore',
        'availableLicensesPerUser',
      ],
      filters: {
        unlimited: '',
        basket: '',
        restricted: '',
        supportExpiration: null,
      },
    }
  },
  methods: {
    resetFilters() {
      this.filters = {
        unlimited: '',
        basket: '',
        restricted: '',
        supportExpiration: null,
      }
    },
  },
  computed: {
    ...mapGetters(['getOracleContracts']),
    toggleReferenceNumber() {
      return _.some(this.getOracleContracts, 'referenceNumber')
    },
  },
}
</script>

<style lang="scss" scoped></style>
